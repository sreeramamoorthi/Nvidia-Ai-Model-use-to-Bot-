require("dotenv").config();
const express = require("express");

// Start the Telegram bot (side-effect import)
require("./bot");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Telegram AI Bot is running ✅");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", model: "nvidia/nemotron-3.5-lightning-30b-a3b" });
});

app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});