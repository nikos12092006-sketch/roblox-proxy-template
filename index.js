import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const COOKIE = process.env.ROBLOX_COOKIE;

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

// ✅ Get gamepasses using Economy API (works for user-owned games)
app.get("/gamepassesByGame/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    // Convert place → universe
    const universeResponse = await fetch(
      `https://apis.roblox.com/universes/v1/places/${gameId}/universe`,
      { headers: { Cookie: `.ROBLOSECURITY=${COOKIE}` } }
    );
    const universeData = await universeResponse.json();
    const universeId = universeData.universeId || gameId;

    // ✅ Get passes from Economy API
    const url = `https://economy.roblox.com/v2/developer-products/list?universeId=${universeId}&page=1`;

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
  console.log(`✅ Roblox proxy running on port ${PORT}`);
});
