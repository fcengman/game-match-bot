import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { GamesData } from "../types/game.js";
import { config } from "../config/config.js";

// Path to your JSON file
// Convert import.meta.url to a directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const gamesFile = path.resolve(__dirname, "../", config.gamesFile);

/**
 * Save the current games data to the JSON file.
 */
export function saveData(gamesData: GamesData) {
  fs.writeFileSync(gamesFile, JSON.stringify(gamesData, null, 2));
}

/**
 * Load the games data from the JSON file.
 * If the file doesn't exist or is empty, returns an empty object.
 */
export function loadData(): GamesData {
    try {
        if (!fs.existsSync(gamesFile)) return {};
        const raw = fs.readFileSync(gamesFile, "utf-8");
        return raw ? (JSON.parse(raw) as GamesData) : {};
    } catch (err) {
        console.error("Failed to read games.json:", err);
        return {};
    }
}


