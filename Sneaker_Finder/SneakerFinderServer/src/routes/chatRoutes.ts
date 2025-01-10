import express, { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import Stockx from "../models/StockX";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const extractPreferences = (message: string) => {
  const preferences: any = {};

  const nameMatch = message.match(/nazwa[:\s]+([\w\s]+)/i);
  if (nameMatch) {
    preferences.name = nameMatch[1].trim();
  }

  const brandMatch = message.match(/mark(?:a|i|ę|a)?[:\s]+([\w\s]+)/i);
  if (brandMatch) {
    preferences.brand = brandMatch[1].trim();
  }

  const colorMatch = message.match(/kolor[:\s]+(\w+)/i);
  if (colorMatch) {
    preferences.color = colorMatch[1].trim().toLowerCase();
  }

  const sizeMatch = message.match(/rozmiar[:\s]+(\w+)/i);
  if (sizeMatch) {
    preferences.size = sizeMatch[1].trim();
  }

  const budgetMatch = message.match(/budżet[:\s]+(\d+)|do\s+(\d+)\s*zł/i);
  if (budgetMatch) {
    preferences.price = parseInt(budgetMatch[1] || budgetMatch[2], 10);
  }

  return preferences;
};

const buildQuery = (preferences: any) => {
  const query: any = {};

  if (preferences.name) {
    query.name = { $regex: preferences.name, $options: "i" };
  }

  if (preferences.brand) {
    query.brand = { $regex: preferences.brand, $options: "i" };
  }

  if (preferences.color) {
    query.color = { $regex: `^${preferences.color}$`, $options: "i" };
  }

  if (preferences.size) {
    query.availableSizes = preferences.size;
  }

  if (preferences.price) {
    query.price = { $lte: preferences.price };
  }

  return query;
};

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  try {
    const preferences = extractPreferences(message);

    const query = buildQuery(preferences);

    const products = await Stockx.find(query).limit(10).exec();

    if (products.length === 0) {
      res.json({
        reply:
          "Niestety, nie znalazłem produktów spełniających Twoje kryteria.",
      });
      return;
    }

    const productList = products
      .map((product, index) => {
        return `### Produkt ${index + 1}: **${product.name}**
- **Marka**: ${product.brand}
- **Kolor**: ${product.color}
- **Cena**: ${product.price} PLN
- **Dostępne rozmiary**: ${product.availableSizes.join(", ")}`;
      })
      .join("\n\n");

    const systemMessage = `Jesteś pomocnym asystentem modowym. Masz do dyspozycji listę produktów poniżej. Możesz korzystać ze swojej wiedzy na temat produktów, aby dostarczyć dodatkowe informacje, takie jak czy dany produkt jest elegancki, sportowy itp. Jednak rekomendacje powinny być oparte wyłącznie na produktach z tej listy.

Proszę formatować odpowiedzi w Markdown, używając pogrubienia dla nazw produktów oraz list punktowanych dla cech każdego produktu. Staraj się dostarczać dodatkowe informacje, które mogą pomóc użytkownikowi w podjęciu decyzji, ale nie sugeruj produktów spoza listy.`;

    const userPrompt = `${message}\n\nOto dostępne produkty:\n${productList}\n\nProszę o rekomendacje.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userPrompt,
        }
      ],
      max_tokens: 700,
      temperature: 0.7,
    });

    const generatedText = response.choices[0]?.message?.content || "Nie udało się wygenerować odpowiedzi.";

    res.json({ reply: generatedText });
  } catch (err: any) {
    console.error(
      "Błąd podczas komunikacji z OpenAI API lub MongoDB:",
      err.response?.data || err.message || err
    );
    res.status(500).json({
      error: "Wystąpił błąd podczas przetwarzania Twojego żądania.",
    });
  }
});

export default router;
