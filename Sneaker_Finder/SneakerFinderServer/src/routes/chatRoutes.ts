import express, { Request, Response } from "express";
import { OpenAI } from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant specializing in helping users choose the best shoes for their needs. Provide recommendations based on style, purpose, budget, and personal preferences. Be concise and clear in your advice."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.6,
    });

    const generatedText =
      response.choices[0]?.message?.content || "No response generated.";
    res.json({ reply: generatedText });
  } catch (err: any) {
    console.error(
      "Error communicating with OpenAI API:",
      err.response?.data || err.message || err
    );
    res.status(500).json({
      error: "Error communicating with OpenAI API.",
    });
  }
});

export default router;
