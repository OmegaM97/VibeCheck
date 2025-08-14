import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

interface JournalCardProps {
  date?: Date;
}

const LS_KEY = (dateKey: string) => `journal-entry-${dateKey}`;

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

  // Load saved entry only once per dateKey
  useEffect(() => {
    const existing = localStorage.getItem(LS_KEY(dateKey)) || "";
    setText(existing);
  }, [dateKey]);

  const handleSave = async () => {
    await controls.start({
      scale: [1, 1.05, 1],
      backgroundColor: ["#1C1C1C", "#2a2a2a", "#1C1C1C"],
      transition: { duration: 0.5 },
    });

    localStorage.setItem(LS_KEY(dateKey), text.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
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
