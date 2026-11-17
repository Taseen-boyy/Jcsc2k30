"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const links = [
  { href: "/", label: "হোম" },
  { href: "/members", label: "আমাদের ব্যাচ" },
  { href: "/gallery", label: "গ্যালারি" },
  { href: "/notices", label: "নোটিশ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#030e2e]/95 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full overflow-hidden group-hover:scale-110 transition-transform glow-blue">
            <Image
              src="/logo.png"
              alt="JCSC 2K30"
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-bold tracking-widest text-white">
              JCSC
            </div>
            <div className="text-[10px] text-gold-400 tracking-widest font-medium">
              2K30
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "text-gold-400"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-white/80 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#061a4a]/98 backdrop-blur-xl border-t border-white/5 px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium py-2 ${
                pathname === l.href ? "text-gold-400" : "text-white/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
        }
