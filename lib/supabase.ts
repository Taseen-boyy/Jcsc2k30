import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (for admin API routes)
export const supabaseAdmin = () =>
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

export type Member = {
  id: string;
  name: string;
  roll_number: string;
  section: string;
  photo_url: string;
  future_plan: string;
  quote: string;
  facebook_url: string;
  instagram_url: string;
  position: "student" | "cr" | "vice_cr" | "monitor";
  is_featured: boolean;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  image_url: string;
  caption: string;
  event_name: string;
  taken_at: string;
  created_at: string;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  created_at: string;
};

export type Achievement = {
  id: string;
  member_id: string;
  title: string;
  description: string;
  year: number;
  created_at: string;
};
