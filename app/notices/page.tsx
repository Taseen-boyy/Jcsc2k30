"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Bell, AlertCircle } from "lucide-react";
import type { Notice } from "@/lib/supabase";

const empty: Partial<Notice> = {
  title: "",
  content: "",
  is_important: false,
};

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Notice>>(empty);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetch = async () => {
    const { data } = await supabase
      .from("notices")
      .select("*")
      .order("is_important", { ascending: false })
      .order("created_at", { ascending: false });
    setNotices(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(empty); setIsEdit(false); setModal(true); };
  const openEdit = (n: Notice) => { setEditing(n); setIsEdit(true); setModal(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing.title || !editing.content) { toast.error("Title ও content দাও"); return; }
    setLoading(true);

    if (isEdit && editing.id) {
      const { error } = await supabase.from("notices").update({
        title: editing.title,
        content: editing.content,
        is_important: editing.is_important,
      }).eq("id", editing.id);
      if (error) toast.error("Update failed");
      else { toast.success("আপডেট হয়েছে!"); setModal(false); fetch(); }
    } else {
      const { error } = await supabase.from("notices").insert([{
        title: editing.title,
        content: editing.content,
        is_important: editing.is_important,
      }]);
      if (error) toast.error("Save failed");
      else { toast.success("নোটিশ দেওয়া হয়েছে!"); setModal(false); fetch(); }
    }
    setLoading(false);
  };

  const deleteNotice = async (id: string) => {
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Delete হয়েছে"); fetch(); setDeleteConfirm(null); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Notices</h1>
          <p className="text-white/40 text-sm mt-1">{notices.length} টি নোটিশ</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#1565c0] hover:bg-[#1976d2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          নোটিশ দাও
        </button>
      </div>

      {notices.length === 0 ? (
        <div
          className="glass-card rounded-2xl flex flex-col items-center justify-center py-20 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={openAdd}
        >
          <Bell className="w-12 h-12 text-white/10 mb-4" />
          <p className="text-white/30 text-sm">কোনো নোটিশ নেই। এখানে click করে দাও।</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`glass-card rounded-xl p-5 border-l-4 ${
                n.is_important ? "border-gold-500" : "border-[#1565c0]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {n.is_important && (
                      <span className="flex items-center gap-1 text-[11px] bg-gold-500/15 text-gold-400 px-2 py-0.5 rounded-full font-semibold">
                        <AlertCircle className="w-3 h-3" />
                        গুরুত্বপূর্ণ
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{n.title}</h3>
                  <p className="text-xs text-white/40 line-clamp-2">{n.content}</p>
                  <p className="text-[11px] text-white/20 mt-2">
                    {new Date(n.created_at).toLocaleDateString("bn-BD", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(n)}
                    className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(n.id)}
                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-display text-xl font-bold text-white">
                {isEdit ? "নোটিশ Edit করো" : "নতুন নোটিশ দাও"}
              </h2>
              <button onClick={() => setModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={save} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs text-white/50 mb-2 block">Title *</label>
                <input
                  value={editing.title || ""}
                  onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="নোটিশের বিষয়..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-2 block">Content *</label>
                <textarea
                  value={editing.content || ""}
                  onChange={(e) => setEditing((p) => ({ ...p, content: e.target.value }))}
                  required
                  rows={5}
                  placeholder="নোটিশের বিস্তারিত..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors resize-none"
                />
              </div>

              {/* Important toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditing((p) => ({ ...p, is_important: !p.is_important }))}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    editing.is_important ? "bg-gold-500" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${
                      editing.is_important ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 ${editing.is_important ? "text-gold-400" : "text-white/30"}`} />
                  <span className="text-sm text-white/60">গুরুত্বপূর্ণ নোটিশ হিসেবে mark করো</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="flex-1 glass-card text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1565c0] hover:bg-[#1976d2] disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  {loading ? "সেভ হচ্ছে..." : isEdit ? "আপডেট করো" : "নোটিশ দাও"}
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
            <h3 className="font-display text-xl font-bold text-white mb-2">নোটিশ Delete করবে?</h3>
            <p className="text-white/40 text-sm mb-6">চিরতরে মুছে যাবে।</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 glass-card text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold">বাতিল</button>
              <button onClick={() => deleteNotice(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-semibold transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
      }
