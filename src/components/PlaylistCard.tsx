import { motion } from "framer-motion";
import type { Playlist } from "../data/playlistInterface";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <motion.div
      className="bg-gradient-to-br from-sky-900/60 to-blue-900/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-5">
        <motion.h3 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
          {playlist.name}
        </motion.h3>
        <motion.span className="text-xs bg-white/10 px-2.5 py-1 rounded-full">
          {playlist.tracks.length} tracks
        </motion.span>
      </div>

      {/* Scrollable track list */}
      <motion.ul className="space-y-3 max-h-[260px] overflow-y-auto pr-2 custom-scroll">
        {playlist.tracks.map((track) => (
          <li
            key={track.id}
            className="relative overflow-hidden rounded-xl border border-white/5 flex items-center gap-4 p-3 bg-cover bg-center transition-colors"
            style={{ backgroundImage: `url(${track.cover})` }}
          >
            {/* Dark gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

            {/* Cover image (above gradient, but small) */}
            <img
              src={track.cover}
              alt={track.title}
              className="w-14 h-14 rounded-lg object-cover shadow-lg relative z-10"
            />

            {/* Text content (always readable on dark overlay) */}
            <div className="flex-1 min-w-0 relative z-10">
              <h4 className="text-sm text-white font-medium truncate">
                {track.title}
              </h4>
              <p className="text-xs text-gray-200 truncate">{track.artist}</p>
            </div>

            {/* Play button */}
            <a
              href={track.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-xs font-medium bg-white/70 hover:bg-white/90 relative z-10"
            >
              Play
            </a>
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
