import { ChatInputCommandInteraction, Client } from "discord.js";
import { getBGGLink } from "../utils/bgg.js";

export const findLinkCommand = async (interaction : ChatInputCommandInteraction) => {
    const name = interaction.options.getString("name");
    if (!name) return;
    const link = (await getBGGLink(name)) || null;

    await interaction.reply({
        content: `${link}`,
        ephemeral: true
    });
}