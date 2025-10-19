import { Client, GatewayIntentBits, REST, Routes, TextChannel } from "discord.js";
import { config } from "./config/config.js";
import {interactionCreate } from "./events/iinteractionCreate.js"
import { commands } from "./data/commandData.js" ;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const rest = new REST({ version: "10" }).setToken(config.token);

// Register guild commands
(async () => {
  try {
    console.log("Registering slash commands for guild...");
    await rest.put(
      Routes.applicationGuildCommands(config.client_id, config.guild_id),
      { body: commands }
    );
    console.log("✅ Commands registered!");
  } catch (error) {
    console.error(error);
  }
})();

// Interaction handling
client.on("interactionCreate", async (interaction) => {
  await interactionCreate(interaction, client);
});

client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);

//   const channel = await client.channels.fetch(process.env.ALLOWED_CHANNEL_ID!) as TextChannel;
//   if (channel?.isTextBased()) {
//     await getOrCreatePinnedMessage(client, channel);
//   }
});
client.login(config.token);