import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY as string
);

interface Mood {
  mood: string | null;
  mood_date: string;
}

interface AnalysisResponse {
  trend: string;
  positives: string[];
  negatives: string[];
  suggestions: string[];
}

export default function MoodAnalysis() {
  const [weekMoods, setWeekMoods] = useState<Mood[]>([]);
  weekMoods;
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeekMoods = async () => {
      const today = new Date();
      const dates: string[] = [];

      // Get last 7 days in YYYY-MM-DD format
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        dates.push(d.toISOString().split("T")[0]);
      }

      // Fetch moods for the current user
      const { data, error } = await supabase
        .from("moods")
        .select("mood, mood_date")
        .in("mood_date", dates);

      if (error) {
        console.error("Error fetching moods:", error);
        setIsLoading(false);
        return;
      }

      // Fill missing days with null
      const weekData: Mood[] = dates.map((date) => {
        const moodEntry = data?.find((d) => d.mood_date === date);
        return { mood: moodEntry?.mood || null, mood_date: date };
      });

      setWeekMoods(weekData);

      // Ask Gemini for JSON structured analysis
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const moodsText = weekData
          .map((m) => `${m.mood_date}: ${m.mood ?? "no entry"}`)
          .join("\n");

        const prompt = `You are an assistant analyzing moods.
Here are the moods for the last 7 days:\n${moodsText}\n
Return a JSON object with the following structure only (no extra text):
{
  "trend": "short summary of the overall emotional trend",
  "positives": ["list of positive observations"],
  "negatives": ["list of negative observations"],
  "suggestions": ["practical suggestions for emotional well-being"]
}
and give elaborated answer on each topic anddont talk about no entry days`;

        const result = await model.generateContent(prompt);

        // Gemini may wrap JSON in markdown, so we clean it
        const raw = result.response.text().trim();
        const jsonText = raw.replace(/```json|```/g, "");
        const parsed: AnalysisResponse = JSON.parse(jsonText);

        setAnalysis(parsed);
      } catch (err) {
        console.error("Error calling Gemini:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeekMoods();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-950/90 via-indigo-900/90 to-gray-900/90 rounded-2xl shadow-xl backdrop-blur-sm border border-indigo-400/60 text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
        Weekly Mood Analysis
      </h2>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-blue-400 border-r-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-indigo-200">
            Analyzing your mood patterns...
          </p>
        </div>
      ) : !analysis ? (
        <p className="text-center py-8 text-indigo-200">
          Unable to analyze your moods at this time.
        </p>
      ) : (
        <div className="space-y-6">
          <div className="transform transition-all duration-500 hover:scale-[1.02]">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-200">
              <span className="text-xl">📊</span> Overall Trend
            </h3>
            <p className="bg-blue-900/30 p-4 rounded-lg border border-blue-700/30 backdrop-blur-sm transition-all duration-300 hover:bg-blue-900/40">
              {analysis.trend}
            </p>
          </div>

          <div className="transform transition-all duration-500 hover:scale-[1.02]">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-emerald-300">
              <span className="text-xl">✅</span> Positive Highlights
            </h3>
            <ul className="space-y-2">
              {analysis.positives.map((pos, i) => (
                <li
                  key={i}
                  className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-700/30 backdrop-blur-sm transition-all duration-300 hover:bg-emerald-900/30 flex items-start"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-3 flex-shrink-0"></span>
                  <span>{pos}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="transform transition-all duration-500 hover:scale-[1.02]">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-amber-300">
              <span className="text-xl">⚠️</span> Areas to Note
            </h3>
            <ul className="space-y-2">
              {analysis.negatives.map((neg, i) => (
                <li
                  key={i}
                  className="bg-amber-900/20 p-3 rounded-lg border border-amber-700/30 backdrop-blur-sm transition-all duration-300 hover:bg-amber-900/30 flex items-start"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0"></span>
                  <span>{neg}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="transform transition-all duration-500 hover:scale-[1.02]">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-300">
              <span className="text-xl">💡</span> Personalized Suggestions
            </h3>
            <ul className="space-y-2">
              {analysis.suggestions.map((sug, i) => (
                <li
                  key={i}
                  className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-700/30 backdrop-blur-sm transition-all duration-300 hover:bg-indigo-900/30 flex items-start"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mt-2 mr-3 flex-shrink-0"></span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
