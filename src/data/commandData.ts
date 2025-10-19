import { SlashCommandBuilder } from "discord.js";


export const commands = [
  new SlashCommandBuilder()
    .setName("wanttoplay")
    .setDescription("Add a game to your list")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Name of the game")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("minimumPlayerCount")
        .setDescription("The minimum player count before starting a thread")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("link")
        .setDescription("BGG link of the game")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("listgames")
    .setDescription("List your games or another user's games")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User whose games to list")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("listallgames")
    .setDescription("List all users' games"),

  new SlashCommandBuilder()
    .setName("removegame")
    .setDescription("Remove a game from your list")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Name of the game")
        .setRequired(true)
    ),
].map(command => command.toJSON());