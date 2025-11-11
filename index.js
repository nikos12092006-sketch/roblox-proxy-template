import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const COOKIE = process.env.ROBLOSECURITY;

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Roblox Proxy is running ✅" });
});

// ✅ Get user's games
app.get("/gamesByUser/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const url = `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&sortOrder=Asc&limit=50`;

    const response = await fetch(url, {
      headers: { Cookie: `.ROBLOSECURITY=${COOKIE}` },
    });
    const data = await response.json();
    res.json({ ok: true, data });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// ✅ Get gamepasses by game (fixed)
app.get("/gamepassesByGame/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;
    const url = `https://develop.roblox.com/v1/universes/${gameId}/game-passes`;

    const response = await fetch(url, {
      headers: { Cookie: `.ROBLOSECURITY=${COOKIE}` },
    });
    const data = await response.json();
    res.json({ ok: true, data });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
