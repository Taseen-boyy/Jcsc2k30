"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Users, Image, Bell, ArrowRight, PlusCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ members: 0, gallery: 0, notices: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("members").select("*", { count: "exact", head: true }),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
      supabase.from("notices").select("*", { count: "exact", head: true }),
    ]).then(([m, g, n]) => {
      setStats({
        members: m.count || 0,
        gallery: g.count || 0,
        notices: n.count || 0,
      });
    });
  }, []);

  const cards = [
    { label: "Members", value: stats.members, icon: Users, href: "/admin/members", color: "from-[#1565c0] to-[#0d47a1]" },
    { label: "Gallery", value: stats.gallery, icon: Image, href: "/admin/gallery", color: "from-purple-600 to-purple-800" },
    { label: "Notices", value: stats.notices, icon: Bell, href: "/admin/notices", color: "from-gold-600 to-amber-700" },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">JCSC 2K30 Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="glass-card rounded-2xl p-6 group hover:scale-[1.02] transition-transform"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-display text-4xl font-black text-white mb-1">
                {c.value}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/40">{c.label}</span>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-gold-400 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Member যোগ করো", href: "/admin/members?action=add", icon: Users },
            { label: "ছবি আপলোড করো", href: "/admin/gallery?action=add", icon: Image },
            { label: "নোটিশ দাও", href: "/admin/notices?action=add", icon: Bell },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="glass-card rounded-xl px-5 py-4 flex items-center gap-3 hover:bg-white/5 transition-colors group"
              >
                <PlusCircle className="w-4 h-4 text-gold-400" />
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                  {a.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
