"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Star,
  Search,
} from "lucide-react";
import type { Member } from "@/lib/supabase";
import Image from "next/image";

const empty: Partial<Member> = {
  name: "",
  roll_number: "",
  section: "",
  photo_url: "",
  future_plan: "",
  quote: "",
  facebook_url: "",
  instagram_url: "",
  position: "student",
  is_featured: false,
};

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Member>>(empty);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("roll_number", { ascending: true });
    setMembers(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => {
    setEditing(empty);
    setIsEdit(false);
    setModal(true);
  };

  const openEdit = (m: Member) => {
    setEditing(m);
    setIsEdit(true);
    setModal(true);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `members/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("jcsc-photos")
      .upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed"); setUploading(false); return; }
    const { data } = supabase.storage.from("jcsc-photos").getPublicUrl(path);
    setEditing((p) => ({ ...p, photo_url: data.publicUrl }));
    setUploading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing.name) { toast.error("নাম দাও"); return; }
    setLoading(true);

    if (isEdit && editing.id) {
      const { error } = await supabase
        .from("members")
        .update({
          name: editing.name,
          roll_number: editing.roll_number,
          section: editing.section,
          photo_url: editing.photo_url,
          future_plan: editing.future_plan,
          quote: editing.quote,
          facebook_url: editing.facebook_url,
          instagram_url: editing.instagram_url,
          position: editing.position,
          is_featured: editing.is_featured,
        })
        .eq("id", editing.id);
      if (error) toast.error("Update failed");
      else { toast.success("আপডেট হয়েছে!"); setModal(false); fetch(); }
    } else {
      const { error } = await supabase.from("members").insert([{
        name: editing.name,
        roll_number: editing.roll_number,
        section: editing.section,
        photo_url: editing.photo_url,
        future_plan: editing.future_plan,
        quote: editing.quote,
        facebook_url: editing.facebook_url,
        instagram_url: editing.instagram_url,
        position: editing.position,
        is_featured: editing.is_featured,
      }]);
      if (error) toast.error("Save failed");
      else { toast.success("Member যোগ হয়েছে!"); setModal(false); fetch(); }
    }
    setLoading(false);
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Delete হয়েছে"); fetch(); setDeleteConfirm(null); }
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.roll_number?.includes(search)
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Members</h1>
          <p className="text-white/40 text-sm mt-1">{members.length} জন সদস্য</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#1565c0] hover:bg-[#1976d2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Member যোগ করো
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="নাম বা রোল নম্বর দিয়ে খোঁজো..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/30 px-5 py-4 font-medium">সদস্য</th>
                <th className="text-left text-xs text-white/30 px-5 py-4 font-medium">রোল</th>
                <th className="text-left text-xs text-white/30 px-5 py-4 font-medium hidden md:table-cell">Section</th>
                <th className="text-left text-xs text-white/30 px-5 py-4 font-medium hidden md:table-cell">Position</th>
                <th className="text-left text-xs text-white/30 px-5 py-4 font-medium hidden lg:table-cell">Featured</th>
                <th className="text-right text-xs text-white/30 px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1565c0]/30 shrink-0">
                        {m.photo_url ? (
                          <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-white/40 font-bold">
                            {m.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-white font-medium">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-white/50">{m.roll_number || "—"}</td>
                  <td className="px-5 py-4 text-sm text-white/50 hidden md:table-cell">{m.section || "—"}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      m.position === "cr" ? "bg-gold-500/20 text-gold-400" :
                      m.position === "vice_cr" ? "bg-blue-500/20 text-blue-300" :
                      m.position === "monitor" ? "bg-emerald-500/20 text-emerald-300" :
                      "text-white/30"
                    }`}>
                      {m.position === "student" ? "Student" : m.position.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    {m.is_featured && <Star className="w-4 h-4 text-gold-400 fill-current" />}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(m)}
                        className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(m.id)}
                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-white/20 text-sm">
                    কোনো সদস্য পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#061a4a]/95 backdrop-blur z-10">
              <h2 className="font-display text-xl font-bold text-white">
                {isEdit ? "Member Edit করো" : "নতুন Member যোগ করো"}
              </h2>
              <button onClick={() => setModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={save} className="p-6 flex flex-col gap-5">
              {/* Photo upload */}
              <div>
                <label className="text-xs text-white/50 mb-2 block">ছবি</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-[#0a2d6e]/50 overflow-hidden shrink-0">
                    {editing.photo_url ? (
                      <img src={editing.photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl font-bold">
                        {editing.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white px-4 py-2 rounded-lg transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {uploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড"}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
                    />
                    {editing.photo_url && (
                      <button
                        type="button"
                        onClick={() => setEditing((p) => ({ ...p, photo_url: "" }))}
                        className="text-xs text-red-400/70 hover:text-red-400"
                      >
                        ছবি সরাও
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Name & Roll */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 mb-2 block">নাম *</label>
                  <input
                    value={editing.name || ""}
                    onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="পূর্ণ নাম"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">রোল নম্বর</label>
                  <input
                    value={editing.roll_number || ""}
                    onChange={(e) => setEditing((p) => ({ ...p, roll_number: e.target.value }))}
                    placeholder="যেমন: ১২"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
                  />
                </div>
              </div>

              {/* Section & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Section</label>
                  <input
                    value={editing.section || ""}
                    onChange={(e) => setEditing((p) => ({ ...p, section: e.target.value }))}
                    placeholder="A / B / C"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Position</label>
                  <select
                    value={editing.position || "student"}
                    onChange={(e) => setEditing((p) => ({ ...p, position: e.target.value as any }))}
                    className="w-full bg-[#0a2d6e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1565c0] transition-colors"
                  >
                    <option value="student">Student</option>
                    <option value="cr">CR</option>
                    <option value="vice_cr">Vice CR</option>
                    <option value="monitor">Monitor</option>
                  </select>
                </div>
              </div>

              {/* Quote */}
              <div>
                <label className="text-xs text-white/50 mb-2 block">Quote</label>
                <input
                  value={editing.quote || ""}
                  onChange={(e) => setEditing((p) => ({ ...p, quote: e.target.value }))}
                  placeholder="জীবনের favorite quote..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
                />
              </div>

              {/* Future plan */}
              <div>
                <label className="text-xs text-white/50 mb-2 block">ভবিষ্যৎ পরিকল্পনা / স্বপ্ন</label>
                <input
                  value={editing.future_plan || ""}
                  onChange={(e) => setEditing((p) => ({ ...p, future_plan: e.target.value }))}
                  placeholder="বড় হয়ে কী হতে চাও..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
                />
              </div>

              {/* Social */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Facebook URL</label>
                  <input
                    value={editing.facebook_url || ""}
                    onChange={(e) => setEditing((p) => ({ ...p, facebook_url: e.target.value }))}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Instagram URL</label>
                  <input
                    value={editing.instagram_url || ""}
                    onChange={(e) => setEditing((p) => ({ ...p, instagram_url: e.target.value }))}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditing((p) => ({ ...p, is_featured: !p.is_featured }))}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    editing.is_featured ? "bg-gold-500" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${
                      editing.is_featured ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <Star className={`w-4 h-4 ${editing.is_featured ? "text-gold-400 fill-current" : "text-white/30"}`} />
                  <span className="text-sm text-white/60">Homepage-এ featured করো</span>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="flex-1 glass-card text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1565c0] hover:bg-[#1976d2] disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  {loading ? "সেভ হচ্ছে..." : isEdit ? "আপডেট করো" : "যোগ করো"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Delete করবে?</h3>
            <p className="text-white/40 text-sm mb-6">এই member-টি চিরতরে মুছে যাবে।</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 glass-card text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold"
              >
                বাতিল
              </button>
              <button
                onClick={() => deleteMember(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-semibold transition-all"
              >
                Delete করো
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
