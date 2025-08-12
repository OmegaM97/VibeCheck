import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import * as z from "zod";

const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormInputs) => {
    console.log("register submitted", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
      >
        Create Account
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
        transition={{ delay: 0.15 }}
      >
        <input
          type="text"
          placeholder="Username"
          {...register("username")}
          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
            errors.username
              ? "border-red-500 focus:ring-red-500/30"
              : "border-gray-200 focus:ring-cyan-500/30"
          }`}
        />
        {errors.username && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.username.message}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
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
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.confirmPassword.message}
          </motion.p>
        )}
      </motion.div>

      <motion.button
        type="submit"
        whileHover={{
          scale: 1.02,
          boxShadow: "0 4px 20px rgba(34, 211, 238, 0.3)",
        }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold mt-2 relative overflow-hidden"
      >
        <span className="relative z-10">Register</span>
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8 }}
        />
      </motion.button>

      <motion.div
        className="text-sm text-center text-gray-600 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Already have an account?{" "}
        <motion.button
          type="button"
          onClick={switchToLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-cyan-600 font-medium hover:underline"
        >
          Sign in
        </motion.button>
      </motion.div>
    </form>
  );
}
