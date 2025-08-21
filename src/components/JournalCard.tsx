import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface JournalCardProps {
  date?: Date;
}

export default function JournalCard({ date }: JournalCardProps) {
  const dateKey = date
    ? date.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const actualDate = new Date(dateKey);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const controls = useAnimation();

  const day = actualDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // ---------------- Load entry from Supabase ----------------
  useEffect(() => {
    const fetchEntry = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id;
      try {
        const { data, error } = await supabase
          .from("journal_entries")
          .select("content")
          .eq("user_id", userId)
          .eq("entry_date", dateKey)
          .single(); // only expect 1 entry per day

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows found
          console.error("Error fetching journal entry:", error.message);
        }

        if (data) {
          setText(data.content);
        } else {
          setText(""); // return empty if nothing found
        }
      } catch (err) {
        console.error("Unexpected error fetching journal entry:", err);
        setText(""); // fallback to empty
      }
    };

    fetchEntry();
  }, [dateKey]);

  // ---------------- Save entry to Supabase ----------------
  const handleSave = async () => {
    await controls.start({
      scale: [1, 1.05, 1],
      backgroundColor: ["#1C1C1C", "#2a2a2a", "#1C1C1C"],
      transition: { duration: 0.5 },
    });

    try {
      const { error } = await supabase.from("journal_entries").insert({
        entry_date: dateKey,
        content: text.trim(),
      });

      if (error) {
        console.error("Error saving journal entry:", error.message);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    } catch (err) {
      console.error("Unexpected error saving journal entry:", err);
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-900/70 to-blue-900/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Daily Journal</h3>
        <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
          {day}
        </span>
      </div>

      <motion.textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-80 rounded-xl p-4 bg-white/5 text-white resize-none outline-none backdrop-blur-sm ring-1 ring-white/10 focus:ring-yellow-400/50 cursor-text"
        placeholder="How was your day? What did the music make you feel?"
        animate={controls}
      />

      <motion.div className="flex justify-end mt-4" whileHover={{ x: -2 }}>
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg"
        >
          {saved ? "✓ Saved" : "Save Entry"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
