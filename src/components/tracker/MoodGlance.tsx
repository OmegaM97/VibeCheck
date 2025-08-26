import { useEffect, useState } from "react";
import happyFace from "../../assets/images/happy-face.png";
import sadFace from "../../assets/images/sad-face.png";
import calmface from "../../assets/images/calm.png";
import anxiousFace from "../../assets/images/fainted.png";
import chillFace from "../../assets/images/chill.png";
import energeticFace from "../../assets/images/energetic.png";
import focusFace from "../../assets/images/focus.png";
import loveFace from "../../assets/images/love.png";
import { supabase } from "../../lib/supabaseClient";

interface Mood {
  mood: string | null;
  mood_date: string;
}

export default function MoodGlance() {
  const [weekMoods, setWeekMoods] = useState<Mood[]>([]);
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

      // Fetch moods for the current user for the last 7 days
      const { data, error } = await supabase
        .from("moods")
        .select("mood, mood_date")
        .in("mood_date", dates);

      if (error) {
        console.error("Error fetching moods:", error);
        setIsLoading(false);
        return;
      }

      // Map over dates and fill missing days with null
      const weekData: Mood[] = dates.map((date) => {
        const moodEntry = data?.find((d) => d.mood_date === date);
        return { mood: moodEntry?.mood || null, mood_date: date };
      });

      setWeekMoods(weekData);
      setIsLoading(false);
    };

    fetchWeekMoods();
  }, []);

  // Function to format date to show day name
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <section className="p-6 bg-gradient-to-br from-blue-950/90 via-indigo-900/90 to-gray-900/90 rounded-2xl shadow-xl backdrop-blur-sm border border-indigo-400/60">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
        Your Week at a Glance
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-blue-400 border-r-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-wrap  gap-3 justify-between">
          {weekMoods.map((mood, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-gradient-to-b from-indigo-900/50 to-blue-950/50 backdrop-blur-md border border-indigo-600/30 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full max-w-[150px] h-[200px] relative overflow-hidden"
            >
              {/* Day indicator */}
              <div className="w-full bg-indigo-800/70 py-1 text-center mb-2 rounded-t-lg">
                <span className="text-xs font-medium text-indigo-100">
                  {formatDate(mood.mood_date)}
                </span>
              </div>

              {/* Mood icon */}
              <div className="flex-1 flex items-center justify-center">
                <span className="text-3xl">
                  {mood.mood === "happy" ? (
                    <img
                      src={happyFace}
                      alt="Happy"
                      className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  ) : mood.mood === "sad" ? (
                    <img
                      src={sadFace}
                      alt="Sad"
                      className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  ) : mood.mood === "anxious" ? (
                    <img
                      src={anxiousFace}
                      alt="Anxious"
                      className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  ) : mood.mood === "energetic" ? (
                    <img
                      src={energeticFace}
                      alt="Energetic"
                      className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  ) : mood.mood === "relaxed" ? (
                    <img
                      src={calmface}
                      alt="Relaxed"
                      className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  ) : mood.mood === "focus" ? (
                    <img
                      src={focusFace}
                      alt="Focused"
                      className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  ) : mood.mood === "chill" ? (
                    <img
                      src={chillFace}
                      alt="Chill"
                      className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  ) : mood.mood === "romantic" ? (
                    <img
                      src={loveFace}
                      alt="Romantic"
                      className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 text-2xl">
                      ?
                    </div>
                  )}
                </span>
              </div>

              {/* Mood label */}
              <div className="mt-2 text-center w-full">
                <p className="text-xs font-medium text-indigo-200 capitalize truncate px-1">
                  {mood.mood || "No entry"}
                </p>
                <p className="text-[10px] text-indigo-300/80 mt-1">
                  {new Date(mood.mood_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
