import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030e2e]/80 backdrop-blur-xl mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src="/logo.png" alt="JCSC 2K30" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-white">
                  JCSC 2K30
                </div>
                <div className="text-[10px] text-gold-400">SSC Batch 2030</div>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              জামালপুর কালেক্টরেট স্কুল এন্ড কলেজ
              <br />
              আমাদের বন্ধুত্ব, আমাদের স্মৃতি।
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
              পেজসমূহ
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/members", label: "আমাদের ব্যাচ" },
                { href: "/gallery", label: "গ্যালারি" },
                { href: "/notices", label: "নোটিশ" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs text-white/40 hover:text-gold-400 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* School info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
              স্কুল
            </h4>
            <p className="text-xs text-white/40 leading-relaxed">
              জামালপুর কালেক্টরেট স্কুল এন্ড কলেজ
              <br />
              প্রতিষ্ঠিত: ২০২০
              <br />
              পরিচালনায়: জেলা প্রশাসন, জামালপুর
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/20">
            © 2024 JCSC 2K30. All rights reserved.
          </p>
          <p className="text-[11px] text-white/20 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-current" /> by
            Batch 2030
          </p>
        </div>
      </div>
    </footer>
  );
}
