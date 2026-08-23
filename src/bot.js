require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { getAIResponse } = require("./ai");

const token = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ TELEGRAM_BOT_TOKEN is missing in .env");
  process.exit(1);
}

// Create bot with polling
const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Telegram bot started (polling)...");

// /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from?.first_name || "there";
  bot.sendMessage(
    chatId,
    `👋 Hello ${name}!\n\nI'm an AI chatbot powered by NVIDIA Nemotron 3.5 Lightning.\n\nJust send me any message and I'll answer.\n\nCommands:\n/start - Welcome\n/help - Show help`
  );
});

// /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `📖 Available commands:\n\n/start - Welcome message\n/help - Show this help\n\nJust type any question or message and I will reply using AI.`
  );
});

// Handle all other text messages
bot.on("message", async (msg) => {
  // Ignore non-text or commands (commands are handled above)
  if (!msg.text || msg.text.startsWith("/")) {
    return;
  }

  const chatId = msg.chat.id;
  const userText = msg.text;

  // Show typing indicator
  bot.sendChatAction(chatId, "typing");

  try {
    const reply = await getAIResponse(userText);
    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error("AI Error:", err.message || err);
    await bot.sendMessage(
      chatId,
      "Sorry, I couldn't get a response from the AI right now. Please try again later."
    );
  }
});

// Error handling
bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message || error);
});

module.exports = bot;