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
import type { Track, MoodKey } from "../utils/playlistInterface";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../lib/supabaseClient";

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

// MusicNote component for the floating notes
const MusicNote = () => {
  const randomLeft = Math.random() * 100;
  const randomAnimationDuration = 15 + Math.random() * 20;
  const randomDelay = Math.random() * 5;
  const randomOpacity = 0.1 + Math.random() * 0.3;
  const randomSize = 20 + Math.random() * 30;

  return (
    <div
      className="absolute text-cyan-400/70 pointer-events-none"
      style={{
        left: `${randomLeft}%`,
        top: "-50px",
        animation: `floatNote ${randomAnimationDuration}s ease-in-out ${randomDelay}s infinite`,
        opacity: randomOpacity,
        fontSize: `${randomSize}px`,
      }}
    >
      ♫
    </div>
  );
};

// ---------------- Dashboard Component ----------------
const Dashboard = () => {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [submittedMood, setSubmittedMood] = useState<MoodKey | null>(null);
  const [databaseSubmittedMood, setDatabaseSubmittedMood] =
    useState<MoodKey | null>(null);
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(
    null
  );
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [loadingDb, setLoadingDb] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState<React.ReactElement[]>([]);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);

  // Create floating notes
  useEffect(() => {
    const musicNotes = Array.from({ length: 20 }).map((_, index) => (
      <MusicNote key={index} />
    ));
    setNotes(musicNotes);
  }, []);

  // ---------------- Check DB on load ----------------
  useEffect(() => {
    const checkTodayData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser(); // ✅ always gives logged in user

      if (!user) {
        setLoadingDb(false);
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      // Check playlist
      const { data: songs } = await supabase
        .from("songs")
        .select("*")
        .eq("date", today)
        .eq("user_id", user.id);

      // Check quote
      const { data: quotes } = await supabase
        .from("quotes")
        .select("*")
        .eq("date", today)
        .eq("user_id", user.id);

      if (songs?.length || quotes?.length) {
        setDatabaseSubmittedMood(songs?.[0]?.mood ?? quotes?.[0]?.mood);
        setPlaylist(
          (songs ?? []).map((s: any) => ({
            id: s.id,
            title: s.title,
            artist: s.artist,
            cover: s.cover_url,
            link: s.external_url,
          }))
        );
        if (quotes?.[0])
          setQuote({ quote: quotes[0].text, author: quotes[0].author });
      }

      setLoadingDb(false);
    };

    checkTodayData();
  }, []);

  // ---------------- Fetch Gemini after mood submit ----------------
  useEffect(() => {
    if (!submittedMood) return;
    const today = new Date().toISOString().split("T")[0];

    const getData = async () => {
      setLoadingQuote(true);
      setLoadingPlaylist(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch playlist
      const geminiTracks = await fetchGeminiPlaylist(submittedMood);
      setPlaylist(geminiTracks.length ? geminiTracks : []);
      setLoadingPlaylist(false);

      // Fetch quote
      const geminiQuote = await fetchGeminiQuote(submittedMood);
      if (geminiQuote) setQuote(geminiQuote);
      setLoadingQuote(false);

      // Save playlist and quote to DB
      await Promise.all([
        ...geminiTracks.map((track) =>
          supabase.from("songs").insert({
            user_id: user.id,
            mood: submittedMood,
            title: track.title,
            artist: track.artist,
            cover_url: track.cover,
            external_url: track.link,
            date: today,
          })
        ),
        supabase.from("quotes").insert({
          user_id: user.id,
          mood: submittedMood,
          text: geminiQuote?.quote,
          author: geminiQuote?.author,
          date: today,
        }),
      ]);
    };

    getData();
  }, [submittedMood]);

  async function saveMood(mood: string | null) {
    const today = new Date().toISOString().split("T")[0];

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("No user found:", userError);
      return;
    }

    const { error } = await supabase.from("moods").insert([
      {
        user_id: user.id,
        mood: mood,
        mood_date: today,
      },
    ]);

    if (error) console.error("Error saving mood:", error);
  }

  if (loadingDb) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-gray-900 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-blue-400 border-r-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-200">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-gray-900 relative overflow-hidden"
      style={{ opacity }}
    >
      {/* Floating music notes background */}
      <div className="fixed inset-0 pointer-events-none z-0">{notes}</div>

      <style>
        {`
          @keyframes floatNote {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            90% {
              opacity: 0.2;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="relative z-10">
        <Navbar />
        <motion.main
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
          style={{ scale }}
        >
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {!playlist.length && !isSubmitting ? (
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
                    onSubmit={() => {
                      setIsSubmitting(true);
                      setSubmittedMood(selectedMood);
                      saveMood(selectedMood);
                    }}
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
                    <div className="flex justify-center items-center py-8">
                      <div className="w-8 h-8 border-3 border-indigo-500 border-t-blue-400 border-r-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {(databaseSubmittedMood || submittedMood) &&
                    !loadingPlaylist && (
                      <PlaylistCard
                        playlist={{
                          name: `${
                            databaseSubmittedMood
                              ? databaseSubmittedMood
                              : submittedMood
                          } Playlist`,
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
                      <div className="flex justify-center items-center py-4">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-blue-400 border-r-transparent rounded-full animate-spin"></div>
                      </div>
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
      </div>
    </motion.div>
  );
};

export default Dashboard;
