import {
  Client,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  ButtonInteraction,
  ThreadChannel,
} from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { GamesData, Game } from "../types/game.js";
import { config } from "../config/config.js";

// Path to your JSON file
// Convert import.meta.url to a directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const gamesFile = path.resolve(__dirname, "../", config.gamesFile);

/**
 * Save the current games data to the JSON file.
 */
export function saveData(gamesData: GamesData) {
  fs.writeFileSync(gamesFile, JSON.stringify(gamesData, null, 2));
}

/**
 * Load the games data from the JSON file.
 * If the file doesn't exist or is empty, returns an empty object.
 */
export function loadData(): GamesData {
    try {
        if (!fs.existsSync(gamesFile)) return {};
        const raw = fs.readFileSync(gamesFile, "utf-8");
        return raw ? (JSON.parse(raw) as GamesData) : {};
    } catch (err) {
        console.error("Failed to read games.json:", err);
        return {};
    }
}

export function generateGamesList(): string {
  const data = loadData();
  let result = "";
  for (const [userId, games] of Object.entries(data)) {
    const names = games.map(g => g.name).join(", ");
    result += `<@${userId}>: ${names || "No games"}\n`;
  }
  return result || "No games added yet!";
}

interface WantToPlay {
  userId: string;
  username: string;
  gameName: string;
  gameLink?: string;
  minimumPlayers: number;
}

let pinnedBannerMessage: Message | null = null;

// Track interested users
const gameInterests: Record<string, string[]> = {}; // key = gameName, value = array of userIds

export async function updateBanner(channel: TextChannel, client: Client) {
  const gamesData = loadData(); // { userId: [{ name, link, minimumPlayers }] }
  const usersWantToPlay: {
    userId: string;
    username: string;
    gameName: string;
    gameLink?: string;
    minimumPlayers: number;
  }[] = [];

  // Build list of users who want to play
  for (const [userId, games] of Object.entries(gamesData)) {
    const user = await client.users.fetch(userId).catch(() => null);
    if (!user) continue;

    for (const game of games) {
      usersWantToPlay.push({
        userId,
        username: user.username,
        gameName: game.name,
        gameLink: game.link as string,
        minimumPlayers: game.minimumPlayerCount ?? 2,
      });
    }
  }

  if (!usersWantToPlay.length) return;

  // Generate message content: one line per game
  const contentLines = usersWantToPlay.map(u =>
    u.gameLink
      ? `${u.username} wants to play [${u.gameName}](${u.gameLink})`
      : `${u.username} wants to play ${u.gameName}`
  );
  const content = contentLines.join("\n");

  // Generate buttons: one per game
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  for (const u of usersWantToPlay) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`interested_${u.gameName}`)
        .setLabel(`I'm Interested in ${u.gameName}`)
        .setStyle(ButtonStyle.Primary)
    );
    rows.push(row);
  }

  // Edit existing pinned message if exists
  if (pinnedBannerMessage) {
    try {
      await pinnedBannerMessage.edit({ content, components: rows });
      return pinnedBannerMessage;
    } catch {
      pinnedBannerMessage = null;
    }
  }

  // Otherwise, send new pinned banner message
  const message = await channel.send({ content, components: rows });
  pinnedBannerMessage = message;
  await message.pin();
  return message;
}

// Handle button clicks
export async function handleButton(interaction: ButtonInteraction, client: Client, channel: TextChannel) {
  const [prefix, name] = interaction.customId.split("_");
  if (prefix !== "interested") return;
  const gameName = name!;
  
  const gamesData = loadData();

   // Find original poster and game info
  let gameInfo: { userId: string; name: string; link?: string; minimumPlayers?: number } | undefined;

  for (const [userId, games] of Object.entries(gamesData)) {
    const match = games.find(g => g.name === gameName);
    if (match) {
      gameInfo = { userId, ...match };
      break;
    }
  }

  if (!gameInfo) return;

  if (interaction.user.id === gameInfo.userId) {
    await interaction.reply({
      content: "You can't mark yourself as interested in your own game.",
      ephemeral: true
    });
    return;
  }

  // Initialize list
  if (!gameInterests[gameName]) gameInterests[gameName] = [];

  if (!gameInterests[gameName].includes(interaction.user.id)) {
    gameInterests[gameName].push(interaction.user.id);
  }

  await interaction.reply({ content: `You are now interested in ${gameName}`, ephemeral: true }); 

  const totalPlayers = (gameInterests[gameName].length || 0) + 1; // +1 for poster
  if (totalPlayers >= (gameInfo.minimumPlayers || 2)) {
    const thread: ThreadChannel = await channel.threads.create({
      name: `${gameName} game session`,
      autoArchiveDuration: 60,
      reason: "Enough players interested"
    });

    // Add original poster
    const poster = await client.users.fetch(gameInfo.userId);
    await thread.members.add(poster.id);

    // Add interested users
    for (const userId of gameInterests[gameName]) {
      const user = await client.users.fetch(userId);
      await thread.members.add(user.id);
    }

    await thread.send(`Thread created for **${gameName}** with all interested players!`);
    delete gameInterests[gameName];
  }
}