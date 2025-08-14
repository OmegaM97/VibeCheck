import { motion } from "framer-motion";

interface QuoteCardProps {
  quote: string;
  author?: string;
}

export default function QuoteCard({ quote, author }: QuoteCardProps) {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-blue-900/60 to-blue-900/80 backdrop-blur-sm rounded-2xl p-6 overflow-hidden border border-white/5 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100 },
      }}
      whileHover={{ y: -3 }}
    >
      <div className="absolute -top-6 -left-1 text-8xl opacity-10 select-none">
        “
      </div>
      <p className="text-gray-300 relative z-10 text-semibold">{quote}</p>
      <p className="text-yellow-500 italic mt-3 ">— {author || "Unknown"}</p>

      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-yellow-400/20"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: 0,
          }}
          animate={{
            scale: [0, Math.random() * 0.3 + 0.3, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
          }}
        />
      ))}
    </motion.div>
  );
}
