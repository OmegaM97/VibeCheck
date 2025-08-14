import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MoodSelector from "../components/MoodSelector";
import PlaylistCard from "../components/PlaylistCard";
import QuoteCard from "../components/QuoteCard";
import JournalCard from "../components/JournalCard";
import { MOCK_PLAYLISTS, type MoodKey } from "../data/mockPlaylists";

const MOCK_QUOTES: Record<MoodKey, { quote: string; author: string }> = {
  happy: {
    quote: "Joy is not in things; it is in us.",
    author: "Richard Wagner",
  },
  sad: { quote: "Tears are words the heart can't express.", author: "Unknown" },
  relaxed: {
    quote: "Within you, there is a stillness and a sanctuary.",
    author: "Hermann Hesse",
  },
  energetic: {
    quote: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin",
  },
  focus: {
    quote: "Focus is the art of knowing what to ignore.",
    author: "James Clear",
  },
  anxious: {
    quote: "Feelings are just visitors, let them come and go.",
    author: "Mooji",
  },
  romantic: {
    quote: "Love is the whole thing. We are only pieces.",
    author: "Rumi",
  },
  chill: {
    quote: "Slow down and everything you are chasing will come around.",
    author: "John De Paola",
  },
};

const Dashboard = () => {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [submittedMood, setSubmittedMood] = useState<MoodKey | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [quote, setQuote] = useState(MOCK_QUOTES.happy);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);

  useEffect(() => {
    if (submittedMood) setQuote(MOCK_QUOTES[submittedMood]);
  }, [submittedMood]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-gray-900"
      style={{ opacity }}
    >
      <Navbar />

      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
        style={{ scale }}
      >
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {!submittedMood ? (
              <motion.div
                key="mood-selector"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", damping: 20 },
                }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <MoodSelector
                  selected={selectedMood}
                  onSelect={setSelectedMood}
                  onSubmit={() => setSubmittedMood(selectedMood)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="content-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {submittedMood && (
                    <PlaylistCard
                      playlist={MOCK_PLAYLISTS[submittedMood]}
                      isPlaying={isPlaying}
                      onTrackPlay={setIsPlaying}
                      stopPlaying={() => setIsPlaying(null)}
                    />
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                  transition={{
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    scale: { type: "spring", stiffness: 300 },
                  }}
                >
                  {submittedMood && (
                    <QuoteCard quote={quote?.quote} author={quote?.author} />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <JournalCard />
        </motion.div>
      </motion.main>

      <Footer />
    </motion.div>
  );
};

export default Dashboard;
