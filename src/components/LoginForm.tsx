import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import * as z from "zod";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
  switchToRegister: () => void;
}

export default function LoginForm({ switchToRegister }: LoginFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setLoginError(null);

    try {
      const { email, password } = data;

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If Supabase returned an error object
      if (error) {
        const msg = (error.message ?? "").toString().toLowerCase();

        // Detect invalid credentials-ish errors
        if (
          msg.includes("invalid") ||
          msg.includes("credentials") ||
          msg.includes("password") ||
          msg.includes("email")
        ) {
          setLoginError("Invalid username or password.");
        } else {
          // Generic server-side error (not network)
          setLoginError("Something went wrong. Please try again later.");
        }
        return;
      }

      // If no error and user present -> success
      if (authData?.user) {
        navigate("/dashboard");
      } else {
        // Fallback for unexpected nulls
        setLoginError("Unable to login. Please try again.");
      }
    } catch (err) {
      // Network or fetch-level errors land here
      setLoginError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 min-h-108 justify-center"
      noValidate
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
      >
        Welcome Back
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:ring-red-500/30"
              : "border-gray-200 focus:ring-cyan-500/30"
          }`}
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.email.message}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-red-500 focus:ring-red-500/30"
              : "border-gray-200 focus:ring-cyan-500/30"
          }`}
        />
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.password.message}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        className="flex items-center justify-between text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="flex items-center gap-2 text-gray-600"></label>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/forgot-password")}
          className="text-cyan-600 hover:underline"
        >
          Forgot Password?
        </motion.button>
      </motion.div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{
          scale: loading ? 1 : 1.02,
          boxShadow: loading ? "none" : "0 4px 20px rgba(34, 211, 238, 0.3)",
        }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold mt-2 relative overflow-hidden flex items-center justify-center"
      >
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        ) : (
          <span className="relative z-10">Login</span>
        )}

        {/* subtle hover gloss preserved */}
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8 }}
          aria-hidden="true"
        />
      </motion.button>

      {/* Form level error messages (network / auth / server) */}
      {loginError && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm text-center mt-2"
        >
          {loginError}
        </motion.p>
      )}

      <motion.div
        className="text-sm text-center text-gray-600 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Don't have an account?{" "}
        <motion.button
          type="button"
          onClick={switchToRegister}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-cyan-600 font-medium hover:underline"
        >
          Sign up now
        </motion.button>
      </motion.div>
    </form>
  );
}
