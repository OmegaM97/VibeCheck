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
import QuoteCard from "../components/QuoteCard";
import JournalCard from "../components/JournalCard";
import PlaylistCard from "../components/PlaylistCard";
import type { Track, MoodKey } from "../data/playlistInterface";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ---------------- Gemini Client ----------------
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY as string
);

const fetchGeminiPlaylist = async (mood: string): Promise<Track[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Generate a playlist of 10 songs for the mood "${mood}".
Respond ONLY with valid JSON in the following format:

[
  {
    "id": "1",
    "title": "Song Name",
    "artist": "Artist Name",
    "cover": "https://picsum.photos/200/200?random=1",
    "link": "https://www.youtube.com/results?search_query=artist+song"
  }
]

STRICT RULES:
- No explanations, only pure JSON.
- Exactly 15 objects in the array.
- Every song must include id, title, artist, cover (album art), and link (play URL).
- For the cover images use https://picsum.photos/200/200?random=<id> but always make darker image.
- Make the links by embedding song name + artist in YouTube search URL.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON safely
    const match = text.match(/\[.*\]/s);
    if (!match) throw new Error("No JSON array found in Gemini response");

    const parsed = JSON.parse(match[0]);

    const validTracks: Track[] = parsed.filter(
      (t: any) => t.id && t.title && t.artist && t.cover && t.link
    );

    return validTracks;
  } catch (err) {
    console.error("Gemini playlist fetch failed:", err);
    return [];
  }
};

const fetchGeminiQuote = async (
  mood: string
): Promise<{ quote: string; author: string } | null> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Give me one inspirational quote for the mood "${mood}".
Respond ONLY in strict JSON format:
{
  "quote": "The quote text",
  "author": "Author Name"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const match = text.match(/\{.*\}/s);
    if (!match) throw new Error("No JSON object found in Gemini response");

    const parsed = JSON.parse(match[0]);
    return parsed;
  } catch (err) {
    console.error("Gemini quote fetch failed:", err);
    return null;
  }
};

// ---------------- Dashboard Component ----------------
const Dashboard = () => {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [submittedMood, setSubmittedMood] = useState<MoodKey | null>(null);
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(
    null
  );
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);

  useEffect(() => {
    if (!submittedMood) return;

    const getData = async () => {
      setLoadingQuote(true);
      setLoadingPlaylist(true);

      // Fetch playlist
      const geminiTracks = await fetchGeminiPlaylist(submittedMood);
      setPlaylist(geminiTracks.length ? geminiTracks : []);
      setLoadingPlaylist(false);

      // Fetch quote
      const geminiQuote = await fetchGeminiQuote(submittedMood);
      if (geminiQuote) setQuote(geminiQuote);
      setLoadingQuote(false);
    };

    getData();
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
                {loadingPlaylist && (
                  <p className="text-gray-300 italic">Loading playlist...</p>
                )}
                {submittedMood && !loadingPlaylist && (
                  <PlaylistCard
                    playlist={{
                      name: `${submittedMood} Playlist`,
                      tracks: playlist,
                    }}
                  />
                )}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                  transition={{
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    scale: { type: "spring", stiffness: 300 },
                  }}
                >
                  {loadingQuote && (
                    <p className="text-gray-300 italic">Loading quote...</p>
                  )}
                  {!loadingQuote && quote && (
                    <QuoteCard quote={quote.quote} author={quote.author} />
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
