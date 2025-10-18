export interface Game {
    name: string;
    link?: string;
}

export interface GamesData {
  [userId: string]: Game[];
}