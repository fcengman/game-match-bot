

export async function getBGGLink(gameName: string): Promise<string | undefined> {
  try {
    const url = `https://boardgamegeek.com/geeksearch.php?action=search&q=${encodeURIComponent(gameName)}&objecttype=boardgame`;
    const res = await fetch(url);
    const text = await res.text();

    // parse XML to find first item id
    const match = text.match(/<item[^>]+id="(\d+)"/);
    if (match) {
      const id = match[1];
      var result = `https://boardgamegeek.com/boardgame/${id}`;
      console.log(result);
      return result;
    }
  } catch (err) {
    console.error("Error fetching BGG link:", err);
  }
  return undefined;
}