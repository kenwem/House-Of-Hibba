import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "../config/firebase";
import { Eye, EyeOff, Lock, Mail, User, Loader2, ArrowLeft, Chrome } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.name });
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
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
    <div className="min-h-screen bg-[#565656] flex items-center justify-center p-6 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-charcoal border border-white/5 p-8 rounded-[40px] shadow-2xl"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 text-xs uppercase tracking-widest transition-colors font-bold">
           <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-display text-white">Join the Community</h1>
          <p className="text-gray-500 mt-2">Create your account to start your journey</p>
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
             <span className="text-[10px] font-bold uppercase tracking-widest">Or email</span>
             <div className="h-[1px] bg-white/5 flex-grow" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <input
                {...register("name")}
                className="w-full bg-[#565656] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-700 outline-none focus:border-pink-500/50 transition-all"
                placeholder="Full Name"
              />
              {errors.name && <p className="text-[10px] text-red-500 ml-4 mt-1 uppercase font-bold">{errors.name.message}</p>}
            </div>

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
                placeholder="Create Password"
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

            {error && <p className="text-xs text-red-500 text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}

            <button
              disabled={isLoading}
              className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-600/10 transition-all"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Already have an account? <Link to="/signin" className="text-pink-500 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
