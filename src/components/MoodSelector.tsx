import { type MoodKey } from "../data/playlistInterface";
import { motion } from "framer-motion";
import happyFace from "../assets/images/happy-face.png";
import sadface from "../assets/images/sad-face.png";
import calmface from "../assets/images/calm.png";
import anxiousFace from "../assets/images/fainted.png";
import chillFace from "../assets/images/chill.png";
import energeticFace from "../assets/images/energetic.png";
import focusFace from "../assets/images/focus.png";
import loveFace from "../assets/images/love.png";

const MOODS: { key: MoodKey; label: string; emoji: string }[] = [
  { key: "happy", label: "Happy", emoji: happyFace },
  { key: "sad", label: "Sad", emoji: sadface },
  { key: "relaxed", label: "Relaxed", emoji: calmface },
  { key: "energetic", label: "Energetic", emoji: energeticFace },
  { key: "focus", label: "Focus", emoji: focusFace },
  { key: "anxious", label: "Anxious", emoji: anxiousFace },
  { key: "chill", label: "Chill", emoji: chillFace },
  { key: "romantic", label: "Romantic", emoji: loveFace },
];

interface MoodSelectorProps {
  selected?: MoodKey | null;
  onSelect: (m: MoodKey) => void;
  onSubmit: () => void;
}

export default function MoodSelector({
  selected,
  onSelect,
  onSubmit,
}: MoodSelectorProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-blue-900/70 to-blue-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-xl font-bold mb-4 text-white">
        How are you feeling today?
      </h3>

      <div className="flex flex-wrap gap-3 mb-6">
        {MOODS.map((m) => {
          const isSelected = selected === m.key;

          return (
            <motion.button
              key={m.key}
              onClick={() => onSelect(m.key)}
              whileHover={{
                scale: 1.1,
                boxShadow: isSelected
                  ? "0 0 25px rgba(255, 215, 0, 0.9)" // brighter if selected & hover
                  : "0 0 15px rgba(159, 122, 234, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: isSelected
                  ? "0 0 20px rgba(255, 215, 0, 0.7)" // permanent glow when selected
                  : "none",
              }}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all
        ${isSelected ? "ring-2 ring-yellow-400 bg-white/10" : "bg-white/5"}`}
              title={m.label}
            >
              <img src={m.emoji} alt={m.label} className="w-13 h-13" />
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={onSubmit}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg shadow-lg"
      >
        Submit Mood
      </motion.button>
    </motion.div>
  );
}
