import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberCard from "@/components/MemberCard";
import Link from "next/link";
import {
  Users,
  Image as ImageIcon,
  Bell,
  ArrowRight,
  Trophy,
} from "lucide-react";

export const revalidate = 60;

async function getData() {
  const [membersRes, noticesRes, galleryRes] = await Promise.all([
    supabase
      .from("members")
      .select("*")
      .eq("is_featured", true)
      .limit(4)
      .order("created_at", { ascending: true }),
    supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);
  return {
    featured: membersRes.data || [],
    notices: noticesRes.data || [],
    gallery: galleryRes.data || [],
  };
}

export default async function HomePage() {
  const { featured, notices, gallery } = await getData();

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1565c0]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#0d47a1]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1a237e]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative animate-float">
              <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-gold-500/50 glow-blue">
                <img
                  src="/logo.png"
                  alt="JCSC 2K30"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <p className="text-gold-400/80 text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            জামালপুর কালেক্টরেট স্কুল এন্ড কলেজ
          </p>

          <h1 className="font-display font-black text-7xl sm:text-8xl md:text-9xl text-white mb-4 leading-none tracking-tight">
            JCSC
            <span className="text-gold-shimmer"> 2K30</span>
          </h1>

          <p className="text-white/50 text-lg sm:text-xl mb-10 font-light tracking-wide">
            SSC Batch 2030 &mdash; একসাথে ছিলাম, একসাথে থাকব
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { n: "34", label: "সদস্য" },
              { n: "2030", label: "SSC ব্যাচ" },
              { n: "2020", label: "প্রতিষ্ঠা" },
            ].map((s) => (
              <div
                key={s.label}
                className="glass-card px-6 py-4 rounded-xl text-center min-w-[100px]"
              >
                <div className="font-display text-2xl font-bold text-gold-400">
                  {s.n}
                </div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/members"
              className="flex items-center gap-2 bg-[#1565c0] hover:bg-[#1976d2] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-900/40"
            >
              <Users className="w-4 h-4" />
              আমাদের ব্যাচ দেখো
            </Link>
            <Link
              href="/gallery"
              className="flex items-center gap-2 glass-card hover:bg-white/10 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 border border-white/10"
            >
              <ImageIcon className="w-4 h-4" />
              গ্যালারি
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
          <span className="text-[10px] tracking-widest uppercase">scroll</span>
        </div>
      </section>

      {/* ══ NOTICES ══ */}
      {notices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gold-400" />
              <h2 className="font-display text-2xl font-bold text-white">
                নোটিশ
              </h2>
            </div>
            <Link
              href="/notices"
              className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
            >
              সব দেখো <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {notices.map((n) => (
              <div
                key={n.id}
                className={`glass-card p-5 rounded-xl border-l-4 ${
                  n.is_important ? "border-gold-500" : "border-[#1565c0]"
                }`}
              >
                {n.is_important && (
                  <span className="text-[10px] bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full mb-2 inline-block uppercase tracking-wider font-semibold">
                    গুরুত্বপূর্ণ
                  </span>
                )}
                <h3 className="font-semibold text-white text-sm mb-2 leading-snug">
                  {n.title}
                </h3>
                <p className="text-xs text-white/40 line-clamp-2">{n.content}</p>
                <p className="text-[11px] text-white/25 mt-3">
                  {new Date(n.created_at).toLocaleDateString("bn-BD")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ FEATURED MEMBERS ══ */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-gold-400" />
              <h2 className="font-display text-2xl font-bold text-white">
                Featured Members
              </h2>
            </div>
            <Link
              href="/members"
              className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
            >
              সবার প্রোফাইল <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((m) => (
              <MemberCard key={m.id} member={m as any} />
            ))}
          </div>
        </section>
      )}

      {/* ══ GALLERY PREVIEW ══ */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-gold-400" />
              <h2 className="font-display text-2xl font-bold text-white">
                স্মৃতির ছবি
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
            >
              সব দেখো <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {gallery.map((g, i) => (
              <div
                key={g.id}
                className={`relative overflow-hidden rounded-xl bg-[#061a4a] group ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
                style={{ aspectRatio: i === 0 ? "auto" : "1" }}
              >
                {g.image_url && (
                  <img
                    src={g.image_url}
                    alt={g.caption || "Gallery"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ minHeight: i === 0 ? "300px" : "150px" }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-3 right-3">
                    {g.caption && (
                      <p className="text-white text-xs font-medium">{g.caption}</p>
                    )}
                    {g.event_name && (
                      <p className="text-gold-400 text-[10px] mt-0.5">{g.event_name}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
