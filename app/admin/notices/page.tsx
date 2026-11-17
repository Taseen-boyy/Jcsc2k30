import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bell, AlertCircle } from "lucide-react";

export const revalidate = 60;

export default async function NoticesPage() {
  const { data: notices } = await supabase
    .from("notices")
    .select("*")
    .order("is_important", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-xs text-gold-400 mb-6">
            <Bell className="w-3.5 h-3.5" />
            আপডেট
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white mb-4">
            নোটিশ <span className="text-gold-shimmer">বোর্ড</span>
          </h1>
        </div>

        {!notices || notices.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl">
            <Bell className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/30">এখনো কোনো নোটিশ নেই।</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notices.map((n) => (
              <div
                key={n.id}
                className={`glass-card rounded-xl p-6 border-l-4 ${
                  n.is_important ? "border-gold-500" : "border-[#1565c0]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {n.is_important && (
                        <div className="flex items-center gap-1.5 bg-gold-500/15 text-gold-400 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider">
                          <AlertCircle className="w-3 h-3" />
                          গুরুত্বপূর্ণ
                        </div>
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-white text-lg mb-3 leading-snug">
                      {n.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
                      {n.content}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <p className="text-xs text-white/25">
                    {new Date(n.created_at).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
