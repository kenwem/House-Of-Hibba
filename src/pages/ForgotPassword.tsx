import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import { motion } from "motion/react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Success! Check your email for password reset instructions.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#565656] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-charcoal border border-white/5 p-8 rounded-[40px] shadow-2xl"
      >
        <Link to="/signin" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 text-xs uppercase tracking-widest transition-colors font-bold">
           <ArrowLeft size={14} /> Back to Sign In
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-display text-white">Reset Password</h1>
          <p className="text-gray-500 mt-2">We'll send you a link to reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#565656] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-700 outline-none focus:border-pink-500/50 transition-all font-medium"
              placeholder="Enter your email"
              required
            />
          </div>

          {error && <p className="text-xs text-red-500 text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
          {message && <p className="text-xs text-green-500 text-center bg-green-500/10 p-3 rounded-xl border border-green-500/20">{message}</p>}

          <button
            disabled={isLoading || !email}
            className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-600/10 transition-all flex items-center justify-center gap-3 group"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Send Reset Link
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
