import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberCard from "@/components/MemberCard";
import { Users } from "lucide-react";

export const revalidate = 60;

export default async function MembersPage() {
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("roll_number", { ascending: true });

  const leaders = members?.filter((m) => m.position !== "student") || [];
  const students = members?.filter((m) => m.position === "student") || [];

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-xs text-gold-400 mb-6">
            <Users className="w-3.5 h-3.5" />
            SSC Batch 2030
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white mb-4">
            আমাদের <span className="text-gold-shimmer">ব্যাচ</span>
          </h1>
          <p className="text-white/40 text-lg">
            {members?.length || 0} জন সদস্য — একসাথে ছিলাম, একসাথে থাকব
          </p>
        </div>

        {/* Leaders */}
        {leaders.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gold-500 rounded-full" />
              <h2 className="font-display text-xl font-bold text-white">
                ব্যাচ নেতৃত্ব
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {leaders.map((m) => (
                <MemberCard key={m.id} member={m as any} />
              ))}
            </div>
          </div>
        )}

        {/* All members */}
        <div>
          {leaders.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[#1565c0] rounded-full" />
              <h2 className="font-display text-xl font-bold text-white">
                সকল সদস্য
              </h2>
            </div>
          )}

          {students.length === 0 && leaders.length === 0 ? (
            <div className="text-center py-24 glass-card rounded-2xl">
              <Users className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <p className="text-white/30">এখনো কোনো সদস্য যোগ করা হয়নি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {students.map((m) => (
                <MemberCard key={m.id} member={m as any} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
                  }
