import React, { useEffect, useState } from "react";
import MoodGlance from "../components/tracker/MoodGlance";
import QuoteGlance from "../components/tracker/QuoteGlance";
import MoodInsights from "../components/tracker/MoodInsight";
import JournalEntries from "../components/tracker/JournalEntries";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MoodAnalysis from "../components/tracker/MoodAnalysis";

// Simple music note component without complex typing
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

export default function Tracker() {
  const [notes, setNotes] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    // Create 20 music notes for the background
    const musicNotes = Array.from({ length: 20 }).map((_, index) => (
      <MusicNote key={index} />
    ));
    setNotes(musicNotes);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-gray-900 relative overflow-hidden">
      {/* Floating music notes background */}
      <div className="fixed inset-0 pointer-events-none z-0">{notes}</div>

      {/* CSS for the floating animation */}
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
        <div className="px-6 py-8 space-y-12">
          {/* Week at a Glance */}
          <MoodGlance />

          {/* Music Suggestions */}
          <QuoteGlance />

          {/* Mood Insights */}
          <MoodInsights />

          <MoodAnalysis />
          {/* Journal Entries */}
          <JournalEntries />
        </div>
        <Footer />
      </div>
    </div>
  );
}
