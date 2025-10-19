

export async function getBGGLink(gameName: string): Promise<string | undefined> {
  try {
    const url = `https://boardgamegeek.com/xmlapi2/search?type=boardgame&query=${encodeURIComponent(gameName)}`;
    const res = await fetch(url);
    const xml = await res.text();

    // Extract first game id
    const match = xml.match(/<item[^>]+id="(\d+)"/);
    if (match) {
      const id = match[1];
      const result = `https://boardgamegeek.com/boardgame/${id}`;
      console.log("BGG Link:", result);
      return result;
    }
  } catch (err) {
    console.error("Error fetching BGG link:", err);
  }
  return undefined;
}