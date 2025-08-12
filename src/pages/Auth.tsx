import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import loginPageImage from "../assets/images/login_page_image.jpg";
import registerPageImage from "../assets/images/register_page_image.jpg";

// Floating music note component
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
        duration: 20 + Math.random() * 20,
        repeat: Infinity,
        delay: index * 0.3,
        ease: "linear",
      }}
    >
      {notes[index % notes.length]}
    </motion.div>
  );
};

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialMode = params.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("mode");
    if (q === "register" || q === "login") {
      setMode(q);
    } else {
      navigate("/auth?mode=login", { replace: true });
    }
  }, [location.search, navigate]);

  const switchToRegister = () => {
    setMode("register");
    navigate("/auth?mode=register");
  };

  const switchToLogin = () => {
    setMode("login");
    navigate("/auth?mode=login");
  };

  useEffect(() => {
    const images = ["/images/login-bg.jpg", "/images/register-bg.jpg"];
    images.forEach((src) => {
      new Image().src = src;
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-gray-900 p-4 relative overflow-hidden">
      {/* Floating music notes background */}
      {[...Array(30)].map((_, i) => (
        <MusicNote key={i} index={i} />
      ))}

      {/* Rest of your existing auth component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-w-4xl w-full relative z-10"
      >
        {/* ... rest of your existing JSX remains exactly the same ... */}
        <AnimatePresence mode="popLayout">
          {mode === "register" && (
            <motion.div
              key="register-image"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: "100%",
                opacity: 0,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block flex-1 relative"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={registerPageImage}
                  alt="Group of people enjoying music"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/105 to-blue-600/80"></div>
              </div>

              <div className="relative h-full flex items-center justify-center p-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-center"
                >
                  <h2 className="text-3xl font-bold mb-4">
                    Join Our Community
                  </h2>
                  <p className="text-lg font">
                    Where every mood finds its music.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Section */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: 20,
                  transition: { duration: 0.4 },
                }}
                transition={{ duration: 0.5 }}
              >
                <LoginForm switchToRegister={switchToRegister} />
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: 20,
                  transition: { duration: 0.4 },
                }}
                transition={{ duration: 0.5 }}
              >
                <RegisterForm switchToLogin={switchToLogin} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="popLayout">
          {mode === "login" && (
            <motion.div
              key="login-image"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: "-100%",
                opacity: 0,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block flex-1 relative"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={loginPageImage}
                  alt="Person enjoying music with headphones"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/105 to-pink-900/80"></div>
              </div>

              <div className="relative h-full flex items-center justify-center p-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-center"
                >
                  <h2 className="text-3xl font-bold mb-4">
                    Great to have you back
                  </h2>
                  <p className="text-lg">Reconnect with your rhythm.</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
