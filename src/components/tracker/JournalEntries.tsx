import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface JournalEntry {
  entry_date: string;
  content: string;
}

export default function JournalEntries() {
  const [weekEntries, setWeekEntries] = useState<JournalEntry[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeekEntries = async () => {
      const today = new Date();
      const dates: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        dates.push(d.toISOString().split("T")[0]);
      }

      const { data, error } = await supabase
        .from("journal_entries")
        .select("entry_date, content")
        .in("entry_date", dates);

      if (error) {
        console.error("Error fetching journal entries:", error);
        setIsLoading(false);
        return;
      }

      // Filter out empty entries
      const filteredEntries =
        data?.filter((d) => d.content && d.content.trim() !== "") || [];
      setWeekEntries(filteredEntries);
      setIsLoading(false);
    };

    fetchWeekEntries();
  }, []);

  if (isLoading) {
    return (
      <section className="p-6 bg-gradient-to-br from-blue-950/90 via-indigo-900/90 to-gray-900/90 rounded-2xl shadow-xl backdrop-blur-sm border border-indigo-400/60">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
          Journal Entries
        </h2>
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-blue-400 border-r-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (weekEntries.length === 0) {
    return (
      <section className="p-6 bg-gradient-to-br from-blue-950/90 via-indigo-900/90 to-gray-900/90 rounded-2xl shadow-xl backdrop-blur-sm border border-indigo-400/30 text-center">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
          Journal Entries
        </h2>
        <p className="text-indigo-200/80 mb-4">
          No entries found for this week
        </p>
        <div className="flex justify-center">
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
        <p className="text-indigo-300/60 mt-4">
          Your reflections will appear here once you start journaling
        </p>
      </section>
    );
  }

  return (
    <section className="p-6 bg-gradient-to-br from-blue-950/90 via-indigo-900/90 to-gray-900/90 rounded-2xl shadow-xl backdrop-blur-sm border border-indigo-700/60">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
        Journal Entries
      </h2>
      <div className="space-y-5">
        {weekEntries.map((entry, idx) => {
          const isLong = entry.content.length > 200;
          const isExpanded = expandedEntry === entry.entry_date;
          const displayContent = isExpanded
            ? entry.content
            : entry.content.slice(0, 200);

          return (
            <div
              key={idx}
              className="transform transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-indigo-900/30 to-blue-950/30 backdrop-blur-md border border-indigo-600/30 rounded-xl p-5 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-indigo-300 bg-indigo-800/40 py-1 px-3 rounded-full">
                  {new Date(entry.entry_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              </div>

              <div className="relative">
                <p className="text-indigo-100 leading-relaxed whitespace-pre-line">
                  {displayContent}
                  {isLong && !isExpanded && "..."}
                </p>

                {isLong && (
                  <button
                    className="mt-3 text-indigo-300 hover:text-indigo-100 font-medium text-sm flex items-center transition-colors duration-200"
                    onClick={() =>
                      setExpandedEntry(isExpanded ? null : entry.entry_date)
                    }
                  >
                    {isExpanded ? (
                      <>
                        <span>Show less</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Read more</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-indigo-600/10 rounded-full -z-10 transform translate-x-6 translate-y-6"></div>
              <div className="absolute top-0 left-0 w-10 h-10 bg-blue-500/10 rounded-full -z-10 transform -translate-x-3 -translate-y-3"></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
