import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { Eye, EyeOff, Mail, Loader2, ArrowLeft, Chrome, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/");
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Google Sign In failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#565656] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-charcoal border border-white/5 p-8 rounded-[40px] shadow-2xl"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 text-xs uppercase tracking-widest transition-colors font-bold">
           <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-display text-white">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to continue your HIBBA experience</p>
        </div>

        <div className="space-y-6">
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all border border-white"
          >
             <Chrome size={20} /> Continue with Google
          </button>

          <div className="flex items-center gap-4 text-gray-600">
             <div className="h-[1px] bg-white/5 flex-grow" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Or use email</span>
             <div className="h-[1px] bg-white/5 flex-grow" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <input
                {...register("email")}
                className="w-full bg-[#565656] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-700 outline-none focus:border-pink-500/50 transition-all"
                placeholder="Email Address"
              />
              {errors.email && <p className="text-[10px] text-red-500 ml-4 mt-1 uppercase font-bold">{errors.email.message}</p>}
            </div>

            <div className="relative space-y-1">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full bg-[#565656] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-700 outline-none focus:border-pink-500/50 transition-all"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-4 p-1 text-gray-700 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && <p className="text-[10px] text-red-500 ml-4 mt-1 uppercase font-bold">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" title="Recover password" className="text-[10px] text-pink-500 font-bold uppercase tracking-widest hover:underline">Forgot password?</Link>
            </div>

            {error && <p className="text-xs text-red-500 text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}

            <button
              disabled={isLoading}
              className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-600/10 transition-all"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            New here? <Link to="/signup" className="text-pink-500 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
