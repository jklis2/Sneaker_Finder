import express, { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import Stockx from "../models/StockX";

dotenv.config();

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parseUserMessage = async (message: string) => {
  const systemParseMessage = `
Jesteś parserem tekstu. Twoim zadaniem jest przeanalizować tekst użytkownika i wyodrębnić możliwe parametry: marka (brand), kolor (color), rozmiar (size), maksymalny budżet (budget), nazwa produktu (name). 
Jeżeli coś nie zostało wspomniane, ustaw wartość na null. 
Zwróć wyłącznie obiekt JSON z kluczami: "brand", "color", "size", "budget", "name". 
Nie dodawaj żadnego innego tekstu, komentarza ani wyjaśnienia.
`;
  const userParsePrompt = `Tekst użytkownika: "${message}"`;
  const parseResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemParseMessage },
      { role: "user", content: userParsePrompt },
    ],
    max_tokens: 150,
    temperature: 0,
  });
  let parsedData;
  try {
    parsedData = JSON.parse(parseResponse.choices[0]?.message?.content || "{}");
  } catch {
    parsedData = {};
  }
  return parsedData;
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
    query.color = { $regex: preferences.color, $options: "i" };
  }
  if (preferences.size) {
    query.availableSizes = preferences.size;
  }
  if (preferences.budget) {
    query.price = { $lte: preferences.budget };
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
    const preferences = await parseUserMessage(message);
    const query = buildQuery(preferences);
    const products = await Stockx.find(query).limit(10).exec();
    if (products.length === 0) {
      res.json({ reply: "Niestety, nie znalazłem produktów spełniających Twoje kryteria." });
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
    const systemMessage = `Jesteś asystentem modowym. Masz listę produktów z konkretną numeracją. Nie zmieniaj jej, nie usuwaj ani nie dodawaj numerów. Bazuj wyłącznie na tych produktach i formatuj w Markdown z pogrubieniami.`;
    const userPrompt = `${message}\n\nOto dostępne produkty:\n${productList}\n\nProszę o rekomendacje.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 700,
      temperature: 0.7,
    });
    const generatedText = response.choices[0]?.message?.content || "Nie udało się wygenerować odpowiedzi.";
    res.json({ reply: generatedText });
  } catch (err: any) {
    res.status(500).json({ error: "Wystąpił błąd podczas przetwarzania Twojego żądania." });
  }
});

export default router;
