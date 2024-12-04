import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        inputs: message,
        parameters: {
          max_length: 50,
          temperature: 0.7,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );

    if (
      response.data?.error ===
      "Model openai-community/gpt2 is currently loading"
    ) {
      res.status(503).json({
        error:
          "The model is currently loading. Please try again in a few seconds.",
        estimated_time: response.data.estimated_time,
      });
      return;
    }

    const generatedText =
      response.data[0]?.generated_text || "No response generated.";
    res.json({ reply: generatedText });
  } catch (err: any) {
    console.error(
      "Error communicating with Hugging Face API:",
      err.response?.data || err.message || err
    );
    res.status(500).json({
      error: "Error communicating with Hugging Face API.",
    });
  }
});

export default router;
