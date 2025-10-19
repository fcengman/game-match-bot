export interface Game {
    name: string;
    link?: string;
    minimumPlayerCount: number;
}

export interface GamesData {
  [userId: string]: Game[];
}