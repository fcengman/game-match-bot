import * as dotenv from "dotenv";
dotenv.config(); 

export const config = {
    token: process.env.DISCORD_TOKEN! || "",    // Discord bot token
    client_id: process.env.CLIENT_ID! || "",    
    guild_id: process.env.GUILD_ID! || "",    
    channel_id: process.env.ALLOWED_CHANNEL_ID! || "",    
    gamesFile: "../games.json",               // Path to your games JSON
};