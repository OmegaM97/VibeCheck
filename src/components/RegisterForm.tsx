import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import * as z from "zod";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  switchToLogin: () => void;
}

export default function RegisterForm({ switchToLogin }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerMessage, setRegisterMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    setRegisterError(null);
    setRegisterMessage(null);

    try {
      const { email, password } = data;

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // Optional: handle very specific errors like weak password
        if ((error.message ?? "").toLowerCase().includes("password")) {
          setRegisterError("Password is too weak.");
        } else {
          setRegisterError("Something went wrong. Please try again later.");
        }
        return;
      }

      // ✅ Neutral message for both new and existing emails
      setRegisterMessage(
        "If this is a new email account, a confirmation email has been sent. Otherwise, please log in."
      );
    } catch {
      setRegisterError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
      >
        Create Account
      </motion.h2>

      {/* Email */}
      <motion.div>
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
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </motion.div>

      {/* Password */}
      <motion.div>
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
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </motion.div>

      {/* Confirm Password */}
      <motion.div>
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
            errors.confirmPassword
              ? "border-red-500 focus:ring-red-500/30"
              : "border-gray-200 focus:ring-cyan-500/30"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </motion.div>

      {/* Register Button */}
      <motion.button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold mt-2 relative flex items-center justify-center"
      >
        {loading ? (
          <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Register"
        )}
      </motion.button>

      {/* Messages */}
      {registerError && (
        <p className="text-red-500 text-sm text-center mt-2">{registerError}</p>
      )}
      {registerMessage && (
        <p className="text-green-500 text-sm text-center mt-2">
          {registerMessage}
        </p>
      )}

      {/* Switch to login */}
      <div className="text-sm text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="text-cyan-600 font-medium hover:underline"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
