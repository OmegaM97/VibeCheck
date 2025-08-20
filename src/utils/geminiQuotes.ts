import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getQuote(mood?: string) {
  try {
    const prompt = mood
      ? `Give me a short motivational quote about feeling ${mood}.`
      : "Give me a short inspirational quote.";
    
    const result = await model.generateContent(prompt);

    // Gemini response text
    const text = result.response.text();

    // Very simple: just return it as quote
    return {
      quote: text,
      author: "Gemini AI"
    };
  } catch (err) {
    console.error("Gemini error:", err);
    return {
      quote: "Believe in yourself, even when times are tough.",
      author: "Fallback"
    };
  }
}
