"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Lock, Mail, Eye, EyeOff, GraduationCap } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("ভুল email বা password");
    } else {
      toast.success("স্বাগতম!");
      router.push("/admin/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen stars-bg flex items-center justify-center px-4">
      {/* BG orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-[#1565c0]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-[#0d47a1]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1565c0] to-[#061a4a] flex items-center justify-center mx-auto mb-4 glow-blue">
            <GraduationCap className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Admin Panel
          </h1>
          <p className="text-white/40 text-sm mt-1">JCSC 2K30</p>
        </div>

        {/* Form */}
        <form
          onSubmit={login}
          className="glass-card rounded-2xl p-8 flex flex-col gap-5"
        >
          <div>
            <label className="text-xs text-white/50 mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@jcsc2k30.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/50 mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1565c0] hover:bg-[#1976d2] disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] mt-2"
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন করো"}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-6">
          শুধুমাত্র অ্যাডমিনের জন্য
        </p>
      </div>
    </div>
  );
}
