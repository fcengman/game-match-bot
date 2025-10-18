import type { Interaction } from "discord.js";
import { handleCommand } from "../router.js";
import { config } from "../config/config.js";

export const interactionCreate = async (interaction: Interaction) => {
    // Interaction handling
    if (!interaction.isChatInputCommand()) return;
    if (interaction.channelId !== config.channel_id) {
        await interaction.reply({
        content: "❌ This bot only works in a specific channel.",
        ephemeral: true,
        });
        return;
    }
    await handleCommand(interaction);
};