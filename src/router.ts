import type { ChatInputCommandInteraction, Client } from "discord.js";
import { wantToPlayCommand } from "./commands/wanttoplay.js";
import { listAllGamesCommand } from "./commands/listallgames.js";
import { listGamesByUserCommand } from "./commands/listgames.js";
import { removeGameCommand } from "./commands/removegame.js";

const commands: Record<string, (interaction: ChatInputCommandInteraction, client: Client) => Promise<void>> = {
    wanttoplay: wantToPlayCommand,
    listgames: listGamesByUserCommand,
    listallgames: listAllGamesCommand,
    removegame: removeGameCommand,
};

export async function handleCommand(interaction: ChatInputCommandInteraction, client: Client) {
    const command = commands[interaction.commandName];
    if (!command) return;
    await command(interaction, client);
}