import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/images/VibeCheck_Logo.png";

export default function Landing() {
  const navigate = useNavigate();

  const MusicNote = ({ index }: { index: number }) => {
    const notes = ["♪", "♫", "♩", "♬"];
    const size = `${Math.random() * 2 + 1}rem`;
    return (
      <motion.div
        className="absolute text-blue-300 pointer-events-none"
        style={{
          fontSize: size,
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
        }}
        animate={{
          y: [0, -100, -200],
          x: [0, (Math.random() - 0.5) * 100],
          rotate: Math.random() * 360,
          opacity: [0.3, 0.8, 0],
        }}
        transition={{
          duration: 10 + Math.random() * 20,
          repeat: Infinity,
          delay: index * 0.3,
          ease: "linear",
        }}
      >
        {notes[index % notes.length]}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-gray-900 flex flex-col items-center justify-center text-white px-4 overflow-hidden relative">
      {/* Full-screen music notes (100 elements) */}
      {[...Array(100)].map((_, i) => (
        <MusicNote key={i} index={i} />
      ))}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 left-6 font-bold text-xl flex items-center gap-2 z-10"
      >
        <motion.img
          src={logo}
          alt="VibeCheck"
          className="w-8 h-8"
          animate={{
            rotate: [0, 15, -15, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror",
            },
          }}
        />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-200">
          VibeCheck
        </span>
      </motion.div>

      <div className="max-w-4xl mx-auto text-center relative z-10 px-4 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-cyan-200 to-white">
            Your Mood. <br className="md:hidden" />
            Your Music. <br className="md:hidden" />
            Your Story.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-blue-200 mb-10 mx-auto max-w-2xl leading-relaxed"
        >
          Start each day with a track that matches your vibe. <br />
          Get inspired, stay balanced, and track how you feel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(34, 211, 238, 0.7)",
              transition: { duration: 0.3 },
            }}
            whileTap={{
              scale: 0.98,
              boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)",
            }}
            onClick={() => navigate("/auth?mode=login")}
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-lg font-bold rounded-xl relative overflow-hidden"
          >
            <span className="relative z-10">Login</span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(6, 182, 212, 0.15)",
              boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)",
              transition: { duration: 0.3 },
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={() => navigate("/auth?mode=register")}
            className="px-8 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 text-lg font-bold rounded-xl relative group"
          >
            <span className="relative z-10">Register</span>
            <motion.div
              className="absolute bottom-0 left-1/2 h-0.5 bg-cyan-400"
              initial={{ width: 0, x: "-50%" }}
              whileHover={{ width: "80%", x: "-50%" }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex justify-center gap-1.5 mt-20 h-12 items-end"
        >
          {[4, 6, 8, 10, 12, 10, 8, 6, 4].map((height, index) => (
            <motion.div
              key={index}
              className="w-2.5 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t-full"
              initial={{ height: `${height}px` }}
              animate={{
                height: [`${height}px`, `${height + 8}px`, `${height}px`],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.1,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
