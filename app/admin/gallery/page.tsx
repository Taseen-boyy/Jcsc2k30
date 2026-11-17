"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Upload, Trash2, X, Image as ImageIcon, Plus } from "lucide-react";
import type { GalleryItem } from "@/lib/supabase";

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({
    image_url: "",
    caption: "",
    event_name: "",
    taken_at: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch = async () => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `gallery/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("jcsc-photos")
      .upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed"); setUploading(false); return; }
    const { data } = supabase.storage.from("jcsc-photos").getPublicUrl(path);
    setForm((p) => ({ ...p, image_url: data.publicUrl }));
    setUploading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) { toast.error("ছবি আপলোড করো"); return; }
    setSaving(true);
    const { error } = await supabase.from("gallery").insert([{
      image_url: form.image_url,
      caption: form.caption || null,
      event_name: form.event_name || null,
      taken_at: form.taken_at || null,
    }]);
    if (error) toast.error("Save failed");
    else {
      toast.success("ছবি যোগ হয়েছে!");
      setModal(false);
      setForm({ image_url: "", caption: "", event_name: "", taken_at: "" });
      fetch();
    }
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Delete হয়েছে"); fetch(); setDeleteConfirm(null); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Gallery</h1>
          <p className="text-white/40 text-sm mt-1">{items.length} টি ছবি</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-[#1565c0] hover:bg-[#1976d2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          ছবি আপলোড করো
        </button>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div
          className="glass-card rounded-2xl flex flex-col items-center justify-center py-20 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setModal(true)}
        >
          <ImageIcon className="w-12 h-12 text-white/10 mb-4" />
          <p className="text-white/30 text-sm">কোনো ছবি নেই। এখানে click করে যোগ করো।</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((g) => (
            <div
              key={g.id}
              className="relative group rounded-xl overflow-hidden aspect-square bg-[#061a4a]"
            >
              <img
                src={g.image_url}
                alt={g.caption || ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {g.caption && (
                  <p className="text-white text-xs text-center px-2">{g.caption}</p>
                )}
                {g.event_name && (
                  <p className="text-gold-400 text-[11px]">{g.event_name}</p>
                )}
                <button
                  onClick={() => setDeleteConfirm(g.id)}
                  className="mt-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-display text-xl font-bold text-white">ছবি যোগ করো</h2>
              <button onClick={() => setModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={save} className="p-6 flex flex-col gap-4">
              {/* Upload area */}
              <div
                onClick={() => !uploading && fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  form.image_url
                    ? "border-[#1565c0]/50 bg-[#1565c0]/5"
                    : "border-white/10 hover:border-white/20"
                } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{ minHeight: "160px" }}
              >
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt=""
                    className="w-full h-40 object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Upload className="w-8 h-8 text-white/20" />
                    <p className="text-sm text-white/30">
                      {uploading ? "আপলোড হচ্ছে..." : "ছবি বেছে নাও"}
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
              />

              <div>
                <label className="text-xs text-white/50 mb-2 block">Caption</label>
                <input
                  value={form.caption}
                  onChange={(e) => setForm((p) => ({ ...p, caption: e.target.value }))}
                  placeholder="ছবির বর্ণনা..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-2 block">Event / অনুষ্ঠান</label>
                <input
                  value={form.event_name}
                  onChange={(e) => setForm((p) => ({ ...p, event_name: e.target.value }))}
                  placeholder="যেমন: বার্ষিক ক্রীড়া ২০২৮"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#1565c0] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-2 block">তারিখ</label>
                <input
                  type="date"
                  value={form.taken_at}
                  onChange={(e) => setForm((p) => ({ ...p, taken_at: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1565c0] transition-colors"
                />
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
                  disabled={saving || uploading}
                  className="flex-1 bg-[#1565c0] hover:bg-[#1976d2] disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  {saving ? "সেভ হচ্ছে..." : "যোগ করো"}
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
            <h3 className="font-display text-xl font-bold text-white mb-2">ছবি Delete করবে?</h3>
            <p className="text-white/40 text-sm mb-6">চিরতরে মুছে যাবে।</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 glass-card text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold">বাতিল</button>
              <button onClick={() => deleteItem(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-semibold transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
      }
