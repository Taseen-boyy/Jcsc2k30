"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Users,
  Image,
  Bell,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/notices", label: "Notices", icon: Bell },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === "/admin") {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/admin");
      else setLoading(false);
    });
  }, [pathname]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  if (pathname === "/admin") return <>{children}</>;
  if (loading) {
    return (
      <div className="min-h-screen stars-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1565c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen stars-bg flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#061a4a]/95 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1565c0] to-[#0a2d6e] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-white">
                JCSC 2K30
              </div>
              <div className="text-[10px] text-gold-400">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`admin-nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#1565c0]/30 text-white border border-[#1565c0]/30"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-gold-400" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            লগআউট
          </button>
          <Link
            href="/"
            className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white transition-all"
          >
            ← সাইট দেখো
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-[#030e2e]/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/60 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-display text-sm font-bold text-white">
            Admin Panel
          </span>
        </div>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
   }
