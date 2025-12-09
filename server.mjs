import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.CHAT_PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", model: "gemini-2.0-flash" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, context } = req.body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }

    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    if (typeof res.flushHeaders === "function") {
      res.flushHeaders();
    }

    const systemPrompt =
      "You are an evidence-based fitness coach. Provide actionable, science-backed guidance, keep clear safety boundaries, and do not give medical advice. If a question requires medical expertise, advise the user to consult a healthcare professional." +
      (context ? ` Context to consider: ${context}` : "");

    const result = await streamText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      messages,
    });

    for await (const textPart of result.textStream) {
      if (textPart) {
        res.write(`data: ${JSON.stringify({ text: textPart })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Chat streaming error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    }
  }
});

app.use(express.static(__dirname));

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) {
    return;
  }
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Chat server listening on port ${PORT}`);
});
