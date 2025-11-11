import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const COOKIE = process.env.ROBLOSECURITY;

// ✅ Home route to verify proxy is running
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

// ✅ Get gamepasses by game (auto converts placeId → universeId)
app.get("/gamepassesByGame/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    // Step 1: Convert placeId → universeId
    const universeResponse = await fetch(
      `https://apis.roblox.com/universes/v1/places/${gameId}/universe`,
      { headers: { Cookie: `.ROBLOSECURITY=${COOKIE}` } }
    );
    const universeData = await universeResponse.json();
    const universeId = universeData.universeId || gameId;

    // Step 2: Get gamepasses from that universe
    const url = `https://develop.roblox.com/v1/universes/${universeId}/game-passes`;

    const response = await fetch(url, {
      headers: { Cookie: `.ROBLOSECURITY=${COOKIE}` },
    });

    const data = await response.json();
    res.json({ ok: true, data });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// ✅ Start the proxy
app.listen(PORT, () => {
  console.log(`✅ Roblox proxy running on port ${PORT}`);
});
