import { ChatInputCommandInteraction, Client } from "discord.js";
import { loadData } from "../utils/helpers.js";

export const listGamesByUserCommand = async (interaction : ChatInputCommandInteraction, client: Client) => {
    const gamesByUser = loadData();
    
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const userGames = gamesByUser[targetUser.id] || [];

    if (userGames.length === 0) {
        await interaction.reply({
        content: `${targetUser.username} has no games listed.`,
        ephemeral: true,
        });
        return;
    }

    const gameList = userGames
        .map((g, i) => `${i + 1}. ${g.name}${g.link ? ` ${g.link}` : ""}`)
        .join("\n");

    await interaction.reply({
        content: `**${targetUser.username} wants to play:**\n${gameList}`,
        ephemeral: true, // optional: only visible to the user
    });
}