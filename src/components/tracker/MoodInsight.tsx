"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Map string moods to numeric levels
const moodMap: Record<string, number> = {
  happy: 1,
  sad: 2,
  relaxed: 3,
  energetic: 4,
  focus: 5,
  anxious: 6,
  chill: 7,
  romantic: 8,
};

// Ordered mood names for categorical Y-axis
const moodNames = [
  "Happy",
  "Sad",
  "Relaxed",
  "Energetic",
  "Focus",
  "Anxious",
  "Chill",
  "Romantic",
];
const moodLabelMap: Record<number, string> = {
  1: "Happy",
  2: "Sad",
  3: "Relaxed",
  4: "Energetic",
  5: "Focus",
  6: "Anxious",
  7: "Chill",
  8: "Romantic",
};

// Custom dot components
const FilledDot = (props: any) => (
  <circle
    cx={props.cx}
    cy={props.cy}
    r={6}
    fill="#4F46E5"
    stroke="#818CF8"
    strokeWidth={2}
    className="shadow-sm"
  />
);
const HollowDot = (props: any) => (
  <circle
    cx={props.cx}
    cy={props.cy}
    r={5}
    fill="transparent"
    stroke="#94A3B8"
    strokeWidth={2}
    strokeDasharray="3 3"
  />
);

interface MoodData {
  day: string;
  date: string;
  mood: number | null;
}

export default function MoodInsights() {
  const [data, setData] = useState<MoodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeekMoods = async () => {
      const today = new Date();
      const dates: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        dates.push(d.toISOString().split("T")[0]);
      }

      const { data: dbData, error } = await supabase
        .from("moods")
        .select("mood, mood_date")
        .in("mood_date", dates);

      if (error) {
        console.error("Error fetching moods:", error);
        setIsLoading(false);
        return;
      }

      const chartRows = dates.map((date) => {
        const hit = dbData?.find((r) => r.mood_date === date);
        const day = new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
        });
        return {
          day,
          date,
          mood: hit?.mood ? moodMap[hit.mood.toLowerCase()] : null,
        };
      });

      setData(chartRows);
      setIsLoading(false);
    };

    fetchWeekMoods();
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-indigo-900/90 backdrop-blur-sm border border-indigo-600/50 rounded-lg p-3 shadow-lg">
          <p className="text-indigo-200 font-medium">{`Day: ${label}`}</p>
          <p className="text-indigo-100">
            {value == null ? "No entry" : moodLabelMap[value as number]}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="p-6 bg-gradient-to-br from-blue-950/90 via-indigo-900/90 to-gray-900/90 rounded-2xl shadow-xl backdrop-blur-sm border border-indigo-400/60">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
        Mood Insights
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-80">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-blue-400 border-r-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-indigo-900/20 to-blue-950/20 backdrop-blur-md border border-indigo-600/30 rounded-2xl p-5 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#4B5563"
                opacity={0.3}
              />
              <XAxis
                dataKey="day"
                stroke="#CBD5E1"
                tickMargin={10}
                tick={{ fill: "#E2E8F0", fontSize: 12 }}
                axisLine={{ stroke: "#4B5563", opacity: 0.5 }}
              />
              <YAxis
                type="category"
                dataKey="mood"
                stroke="#CBD5E1"
                width={80}
                tickFormatter={(val) =>
                  val === null ? "No entry" : moodLabelMap[val as number]
                }
                ticks={moodNames.map((_, i) => i + 1)}
                interval={0}
                reversed
                allowDataOverflow={true}
                tick={{ fill: "#E2E8F0", fontSize: 11 }}
                axisLine={{ stroke: "#4B5563", opacity: 0.5 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                name="Mood"
                stroke="#818CF8"
                strokeWidth={3}
                connectNulls={true}
                isAnimationActive={true}
                animationDuration={1000}
                dot={(props) =>
                  props.value === null ? (
                    <HollowDot {...props} />
                  ) : (
                    <FilledDot {...props} />
                  )
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex justify-center items-center space-x-4 text-xs text-indigo-200">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></div>
          <span>Mood Entry</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border border-slate-500 rounded-full mr-1"></div>
          <span>No Entry</span>
        </div>
      </div>
    </section>
  );
}
