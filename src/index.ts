import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { config } from "./config/config.js";
import {interactionCreate } from "./events/iinteractionCreate.js"
import commands from "./data/commandData.json" assert { type: "json" };

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
client.on("interactionCreate", interactionCreate);

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);
});

client.login(config.token);