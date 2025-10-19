import { ChatInputCommandInteraction, Client, TextChannel } from "discord.js";
import { loadData, saveData, updateBanner, generateGamesList } from "../utils/helpers.js";

export const removeGameCommand = async (interaction : ChatInputCommandInteraction, client: Client) => {
    var gamesByUser = loadData();
    const name = interaction.options.getString("name");
    const userId = interaction.user.id;
    if (!name) return;

    const userGames = gamesByUser[userId];
    if (!userGames || !userGames.some(g => g.name.toLowerCase() === name.toLowerCase())) {
        await interaction.reply({ content: `You don’t have **${name}** in your list.`, ephemeral: true });
        return;
    }

    // Remove the game by name
    gamesByUser[userId] = userGames.filter(g => g.name.toLowerCase() !== name.toLowerCase());
    saveData(gamesByUser);

    await interaction.reply({ content: `Removed **${name}** from your want to play list.`, ephemeral: true });

     // Update banner
    const channel = interaction.channel;
    if (channel?.isTextBased()) {
        await updateBanner(channel as TextChannel, client);
    }
}