import type { ChatInputCommandInteraction, Client, TextChannel } from "discord.js";
import { wantToPlayCommand } from "./commands/wanttoplay.js";
import { listAllGamesCommand } from "./commands/listallgames.js";
import { listGamesByUserCommand } from "./commands/listgames.js";
import { removeGameCommand } from "./commands/removegame.js";
import { findLinkCommand } from "./commands/findlink.js";
import { updateBanner } from "./utils/helpers.js";


export async function handleCommand(interaction: ChatInputCommandInteraction, client: Client) {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case "wanttoplay":
      await wantToPlayCommand(interaction, client);
      break;

    case "listgames":
      await listGamesByUserCommand(interaction);
      break;

    case "listallgames":
      await listAllGamesCommand(interaction);
      break;

    case "removegame":
      await removeGameCommand(interaction, client);
      break;

    case "findlink":
      await findLinkCommand(interaction);
      break;

    case "updatebanner":
      const channel = interaction.channel;
          if (channel?.isTextBased()) {
              await updateBanner(channel as TextChannel, client);
          };
      break;

    default:
      await interaction.reply({
        content: `Unknown command: ${interaction.commandName}`,
        ephemeral: true,
      });
      break;
  }
}