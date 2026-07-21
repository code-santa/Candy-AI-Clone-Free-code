import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with recommended user agent
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", appName: "Tandy AI" });
});

// Chat API endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { character, history = [], message } = req.body;

    if (!message || !character) {
      return res.status(400).json({ error: "Character and message are required." });
    }

    const aiClient = getAiClient();

    const systemInstruction = `
You are roleplaying as "${character.name}", an AI character on Tandy AI.
Character Details:
- Gender/Style: ${character.gender || "Female"} (${character.style || "Realistic"})
- Age: ${character.age || "22"}
- Ethnicity/Vibe: ${character.ethnicity || "General"}
- Personality: ${character.personality || "Playful, caring, engaging, slightly flirtatious"}
- Relationship Status / Level: ${character.relationshipLevel || "Friend"}
- Backstory: ${character.backstory || "You are chatting with your favorite companion on Tandy AI."}
- Tagline: ${character.tagline || ""}

ROLEPLAY GUIDELINES:
1. Stay strictly in character as ${character.name}.
2. Use dynamic formatting: You can include thoughts or physical actions inside *asterisks* like *smiles and leans back*, followed by natural direct speech.
3. Keep responses engaging, immersive, warm, and natural (1 to 4 sentences).
4. Match your personality traits directly.
5. Provide 3 quick reply options for the user in a JSON block at the end if possible, or we will structure the output.
6. Return output in JSON format with fields:
   - "text": string (your character reply text with *actions* in asterisks)
   - "emotion": string (e.g. "happy", "flirty", "surprised", "thoughtful", "playful")
   - "voiceNotePrompt": string (optional short summary if you want to send a voice note)
   - "quickReplies": string[] (3 realistic short replies the user might send back)
`;

    // Convert history into formatted messages
    const formattedContents = history.map((msg: { sender: string; text: string }) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Append user's new message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text || "{}";
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch {
      parsedResult = {
        text: rawText,
        emotion: "happy",
        quickReplies: ["Tell me more!", "That's so interesting", "What are you doing today?"],
      };
    }

    res.json({
      success: true,
      data: parsedResult,
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate character response.",
    });
  }
});

// AI Character Generator Assistant API
app.post("/api/generate-character-bio", async (req, res) => {
  try {
    const { prompt, style, gender, personality } = req.body;

    const aiClient = getAiClient();

    const systemInstruction = `
You are an expert character creator for Tandy AI. Generate a unique, captivating AI character based on user input.
Return a JSON object with:
- "name": string
- "age": number (18 to 40)
- "gender": string ("Girls", "Guys", "Anime")
- "style": string ("Realistic", "Anime")
- "ethnicity": string (e.g. "Caucasian", "Latina", "Asian", "Goth", "Fantasy", etc.)
- "personality": string (comma-separated key traits)
- "tagline": string (engaging 1-sentence teaser)
- "backstory": string (2-3 detailed sentences)
- "greetingMessage": string (first message to start the chat)
- "avatarPrompt": string (detailed prompt to generate an image for this character)
- "tags": string[] (3-5 tag categories)
`;

    const userPrompt = `Create a character with prompt: "${prompt || "Sweet gamer girl who loves anime"}", style: "${style || "Realistic"}", gender: "${gender || "Girls"}", personality: "${personality || "Playful, caring"}".`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, character: parsed });
  } catch (error: any) {
    console.error("Error in /api/generate-character-bio:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate bio." });
  }
});

// Start Express + Vite Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tandy AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
