import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Playlist, Track } from "../data/mockPlaylists";

interface PlaylistCardProps {
  playlist: Playlist;
  isPlaying: string | null;
  onTrackPlay: (id: string) => void;
  stopPlaying: () => void;
}

const TrackItem = ({
  track,
  isPlaying,
  onClick,
}: {
  track: Track;
  isPlaying: boolean;
  onClick: () => void;
}) => {
  const [waveform, setWaveform] = useState<number[]>([]);
  const [audio] = useState(new Audio(track.preview));

  useEffect(() => {
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    return () => {
      audio.pause();
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setWaveform([]);
      return;
    }
    const bars = Array(5)
      .fill(0)
      .map(() => Math.random() * 40 + 10);
    setWaveform(bars);

    const interval = setInterval(() => {
      setWaveform((prev) =>
        prev.map((h) => Math.max(10, h + (Math.random() * 15 - 7.5)))
      );
    }, 350);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <motion.li
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden group rounded-xl border border-white/5"
      style={{
        backgroundImage: `url(${track.cover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors z-0"></div>

      <div className="flex items-center gap-4 p-3 relative z-10">
        <motion.div
          animate={{ scale: isPlaying ? 1.05 : 1 }}
          className="relative"
        >
          <img
            src={track.cover}
            alt={track.title}
            className="w-14 h-14 rounded-lg object-cover shadow-lg"
          />
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-black/30 flex items-end justify-center gap-0.5 px-1 pb-1"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {waveform.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 bg-yellow-400 rounded-t-sm"
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.4 }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{track.title}</h4>
          <p className="text-xs text-gray-300 truncate">{track.artist}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className={`px-4 py-2 rounded-full text-xs font-medium ${
            isPlaying
              ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {isPlaying ? "Stop" : "Play"}
        </motion.button>
      </div>
    </motion.li>
  );
};

export default function PlaylistCard({
  playlist,
  isPlaying,
  onTrackPlay,
  stopPlaying,
}: PlaylistCardProps) {
  const handleTrackClick = (trackId: string) => {
    if (isPlaying === trackId) {
      stopPlaying();
    } else {
      onTrackPlay(trackId);
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-sky-900/60 to-blue-900/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-5">
        <motion.h3
          className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
          initial={{ x: -10 }}
          animate={{ x: 0 }}
        >
          {playlist.name}
        </motion.h3>
        <motion.span
          className="text-xs bg-white/10 px-2.5 py-1 rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          {playlist.tracks.length} tracks
        </motion.span>
      </div>

      <motion.ul className="space-y-3 max-h-[285px] overflow-y-auto pr-2 custom-scroll">
        {playlist.tracks.map((track) => (
          <TrackItem
            key={track.id}
            track={track}
            isPlaying={isPlaying === track.id}
            onClick={() => handleTrackClick(track.id)}
          />
        ))}
      </motion.ul>
    </motion.div>
  );
}
