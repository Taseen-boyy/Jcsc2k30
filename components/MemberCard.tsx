"use client";

import Image from "next/image";
import { Facebook, Instagram, Quote, Star } from "lucide-react";
import type { Member } from "@/lib/supabase";

const positionLabel: Record<string, string> = {
  cr: "CR",
  vice_cr: "Vice CR",
  monitor: "Monitor",
  student: "",
};

const positionColor: Record<string, string> = {
  cr: "bg-gold-500 text-[#030e2e]",
  vice_cr: "bg-blue-500 text-white",
  monitor: "bg-emerald-500 text-white",
  student: "",
};

export default function MemberCard({ member }: { member: Member }) {
  return (
    <div className="member-card glass-card rounded-2xl overflow-hidden group">
      {/* Photo */}
      <div className="relative h-64 bg-gradient-to-br from-[#0a2d6e] to-[#061a4a] overflow-hidden">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#1565c0]/30 flex items-center justify-center text-5xl font-display font-bold text-white/30">
              {member.name.charAt(0)}
            </div>
          </div>
        )}

        {/* Position badge */}
        {member.position !== "student" && (
          <div
            className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${positionColor[member.position]}`}
          >
            {positionLabel[member.position]}
          </div>
        )}

        {/* Featured star */}
        {member.is_featured && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center glow-gold">
            <Star className="w-4 h-4 text-[#030e2e] fill-current" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030e2e] via-transparent to-transparent opacity-60" />
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-display font-semibold text-white text-lg leading-tight">
            {member.name}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            {member.roll_number && (
              <span className="text-xs text-white/40">
                রোল #{member.roll_number}
              </span>
            )}
            {member.section && (
              <span className="text-xs text-white/40">
                Section {member.section}
              </span>
            )}
          </div>
        </div>

        {/* Quote */}
        {member.quote && (
          <div className="mb-3 flex gap-2">
            <Quote className="w-3 h-3 text-gold-400 mt-1 shrink-0" />
            <p className="text-xs text-white/50 italic leading-relaxed line-clamp-2">
              {member.quote}
            </p>
          </div>
        )}

        {/* Future plan */}
        {member.future_plan && (
          <div className="mb-4">
            <span className="text-[10px] text-gold-400/70 uppercase tracking-wider">
              স্বপ্ন
            </span>
            <p className="text-xs text-white/60 mt-0.5">{member.future_plan}</p>
          </div>
        )}

        {/* Social */}
        {(member.facebook_url || member.instagram_url) && (
          <div className="flex gap-3 pt-3 border-t border-white/5">
            {member.facebook_url && (
              <a
                href={member.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#1877f2] transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
                Facebook
              </a>
            )}
            {member.instagram_url && (
              <a
                href={member.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#e1306c] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                Instagram
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
  }
