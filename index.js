import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const ROBLOX_COOKIE = process.env.ROBLOX_COOKIE;

async function robloxFetch(url) {
  const res = await fetch(url, {
    headers: {
      Cookie: `.ROBLOSECURITY=${ROBLOX_COOKIE}`,
      "User-Agent": "GamepassProxy/1"
    }
  });
  return res.json();
}

app.get("/gamesByUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await robloxFetch(
      `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&sortOrder=Asc&limit=50`
    );
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/gamepassesByGame/:gameId", async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const data = await robloxFetch(
      `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=100&sortOrder=Asc`
    );
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Proxy running on port", PORT));
