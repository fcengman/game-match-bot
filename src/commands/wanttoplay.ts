import { ChatInputCommandInteraction, Client, TextChannel } from "discord.js";
import type { Game } from "../types/game.js";
import { loadData, saveData, updateBanner, generateGamesList } from "../utils/helpers.js";
import { getBGGLink } from "../utils/bgg.js";

export const wantToPlayCommand = async (interaction : ChatInputCommandInteraction, client: Client) => {

    const gamesByUser = loadData()
    const userId = interaction.user.id;
    const name = interaction.options.getString("name");
    const link = interaction.options.getString("link"); // optional
    const playercount = interaction.options.getNumber("minimumplayercount"); // optional
    
    if (!name) return;

    if (!gamesByUser[userId]) gamesByUser[userId] = [];

    let finalLink: string | null = link || null;   
    if (!finalLink) {
        finalLink = (await getBGGLink(name)) || null;
    }

    // Check if user already added this game
    if (gamesByUser[userId].some(g => g.name.toLowerCase() === name.toLowerCase())) {
        await interaction.reply({ content: `You already added **${name}**!`, ephemeral: true });
        return;
    }
    const gameToAdd: Game = finalLink ? { name, link: finalLink, minimumPlayerCount: playercount ?? 2 } : { name,  minimumPlayerCount: playercount ?? 2 };

    gamesByUser[userId].push(gameToAdd);
    saveData(gamesByUser);

    await interaction.reply({
        content: `Added **${name}** to your list!`,
        ephemeral: true
    });

     // Update banner
    const channel = interaction.channel;
    if (channel?.isTextBased()) {
        await updateBanner(channel as TextChannel, client);
    }
}
