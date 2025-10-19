import { ChannelType, Client, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { GamesData } from "../types/game.js";
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

export async function getOrCreatePinnedMessage(client: Client): Promise<Message | null> {
  const channel = await client.channels.fetch(config.channel_id);
  if (!channel || channel.type !== ChannelType.GuildText) return null;

  let pinnedMessageId = null;

  // Try to load from file (so we remember it between restarts)
  if (fs.existsSync(config.pinnedMessageFile)) {
    const data = JSON.parse(fs.readFileSync(config.pinnedMessageFile, "utf8"));
    pinnedMessageId = data.messageId;
  }

  let pinnedMessage = null;

  if (pinnedMessageId) {
    try {
      pinnedMessage = await channel.messages.fetch(pinnedMessageId);
    } catch {
      pinnedMessage = null; // message might have been deleted
    }
  }

  if (!pinnedMessage) {
    pinnedMessage = await channel.send("📋 **Want to Play Games**\nNo games yet!");
    await pinnedMessage.pin();
    fs.writeFileSync(config.pinnedMessageFile, JSON.stringify({ messageId: pinnedMessage.id }, null, 2));
  }

  return pinnedMessage;
}

export async function updateGamesListMessage(client: Client): Promise<void> {
  const pinnedMessage = await getOrCreatePinnedMessage(client);
  if (!pinnedMessage) return;

  const gamesFilePath = path.resolve(__dirname, config.gamesFile);

  if (!fs.existsSync(gamesFilePath)) {
    await pinnedMessage.edit("📋 **Want to Play Games**\n_No games yet!_");
    return;
  }

  const gamesData = JSON.parse(fs.readFileSync(gamesFilePath, "utf8"));
  let text = "📋 **Want to Play Games**\n\n";

  if (Object.keys(gamesData).length === 0) {
    text += "_No games yet!_";
  } else {
    for (const [userId, games] of Object.entries(gamesData as Record<string, any>)) {
      const mention = `<@${userId}>`;
      const gameList = (games as any[])
        .map((g: any) => `• [${g.name}](${g.link ?? "#"})`)
        .join("\n");
      text += `**${mention}**\n${gameList}\n\n`;
    }
  }

  await pinnedMessage.edit(text);
}


