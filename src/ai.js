require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

async function getAIResponse(userMessage) {
  if (!process.env.NVIDIA_API_KEY) {
    throw new Error("NVIDIA_API_KEY is missing in .env");
  }

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "You are a helpful, concise, and friendly AI assistant.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 1024,
  });

  const reply = completion.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("Empty response from NVIDIA API");
  }

  return reply;
}

module.exports = { getAIResponse, MODEL };