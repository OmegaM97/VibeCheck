import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface Quote {
  id: number;
  date: string;
  author: string;
  text: string;
}

export default function WeeklyQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      setLoading(true);

      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);

      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .gte("date", lastWeek.toISOString().split("T")[0])
        .lte("date", today.toISOString().split("T")[0])
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching quotes:", error.message);
      } else if (data) {
        setQuotes(data);
      }

      setLoading(false);
    }

    fetchQuotes();
  }, []);

  return (
    <section className="p-6 bg-gradient-to-br from-blue-950/90 via-indigo-900/90 to-gray-900/90 rounded-2xl shadow-xl backdrop-blur-sm border border-indigo-400/60">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
        Past Week Quotes
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-blue-400 border-r-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-200">Loading quotes...</p>
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-indigo-500/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <p className="text-indigo-200/80">No quotes found for this week.</p>
          <p className="text-indigo-300/60 mt-2">
            you didn't interact with app this week!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quotes.map((quote, index) => (
            <div
              key={quote.id}
              className="transform transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-indigo-900/40 to-blue-950/40 backdrop-blur-md border border-indigo-600/30 rounded-xl p-6 shadow-lg hover:shadow-xl relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Decorative quote marks */}
              <div className="absolute top-4 left-4 text-6xl text-indigo-500/20 font-serif">
                "
              </div>

              <p className="text-indigo-100 italic text-lg leading-relaxed relative z-10 mb-4 pl-6">
                {quote.text}
              </p>

              <div className="flex justify-between items-center pt-3 border-t border-indigo-700/30">
                <span className="text-indigo-300 font-medium text-sm bg-indigo-800/30 py-1 px-3 rounded-full">
                  {quote.author}
                </span>
                <span className="text-indigo-400/80 text-xs">
                  {new Date(quote.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-2 right-2 w-12 h-12 bg-blue-500/10 rounded-full -z-10"></div>
              <div className="absolute top-2 left-8 w-8 h-8 bg-indigo-600/10 rounded-full -z-10"></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
