import { ChatInputCommandInteraction } from "discord.js";
import { loadData } from "../utils/helpers.js";

export const listAllGamesCommand = async (interaction : ChatInputCommandInteraction) => {
    // Get all users who have games
    const gamesByUser = loadData()
    const usersWithGames = Object.entries(gamesByUser).filter(([_, games]) => games.length > 0);

    if (usersWithGames.length === 0) {
        await interaction.reply({
            content: `No games have been listed by any user.`,
            ephemeral: true,
        });
        return;
    }

    const allGamesList = usersWithGames
        .map(([userId, userGames]) => {
            const username = interaction.client.users.cache.get(userId)?.username || "Unknown User";
            const games = userGames
                .map((g, i) => `${i + 1}. ${g.name}`) 
                .join("\n");
            return `**${username} wants to play:**\n${games}`;
        })
        .join("\n\n"); // separate users

    await interaction.reply({
        content: allGamesList,
        ephemeral: true,
    });
}