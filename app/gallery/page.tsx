"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Image as ImageIcon, X } from "lucide-react";
import type { GalleryItem } from "@/lib/supabase";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);

  const events = ["all", ...Array.from(new Set(items.map((i) => i.event_name).filter(Boolean)))];
  const filtered = filter === "all" ? items : items.filter((i) => i.event_name === filter);

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-xs text-gold-400 mb-6">
            <ImageIcon className="w-3.5 h-3.5" />
            স্মৃতির পাতা
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white mb-4">
            আমাদের <span className="text-gold-shimmer">গ্যালারি</span>
          </h1>
          <p className="text-white/40">{items.length} টি ছবি</p>
        </div>

        {/* Filter */}
        {events.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {events.map((e) => (
              <button
                key={e}
                onClick={() => setFilter(e)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  filter === e
                    ? "bg-[#1565c0] text-white"
                    : "glass-card text-white/50 hover:text-white"
                }`}
              >
                {e === "all" ? "সব" : e}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl">
            <ImageIcon className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/30">এখনো কোনো ছবি যোগ করা হয়নি।</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((g) => (
              <div
                key={g.id}
                className="break-inside-avoid cursor-pointer group overflow-hidden rounded-xl relative"
                onClick={() => setSelected(g)}
              >
                <img
                  src={g.image_url}
                  alt={g.caption || "Gallery"}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  {g.caption && (
                    <p className="text-white text-xs font-medium">{g.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass-card flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            onClick={() => setSelected(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.image_url}
              alt={selected.caption || ""}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {(selected.caption || selected.event_name) && (
              <div className="mt-4 text-center">
                {selected.caption && (
                  <p className="text-white font-medium">{selected.caption}</p>
                )}
                {selected.event_name && (
                  <p className="text-gold-400 text-sm mt-1">
                    {selected.event_name}
                  </p>
                )}
                {selected.taken_at && (
                  <p className="text-white/30 text-xs mt-1">
                    {new Date(selected.taken_at).toLocaleDateString("bn-BD")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
