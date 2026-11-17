# JCSC 2K30 Website

## Stack
- Next.js 14 (App Router)
- Supabase (Database + Auth + Storage)
- Tailwind CSS + Framer Motion
- Vercel Deploy

---

## Setup করার ধাপ

### ১. Supabase Project বানাও
1. https://supabase.com → New Project
2. Project name: `jcsc2k30`
3. Region: Southeast Asia (Singapore)

### ২. Database Schema চালাও
1. Supabase Dashboard → SQL Editor
2. `supabase/schema.sql` ফাইলের পুরো content paste করো
3. Run করো

### ৩. Admin User বানাও
1. Supabase Dashboard → Authentication → Users
2. "Add User" → email + password দাও (এটাই admin login)

### ৪. Environment Variables সেট করো
`.env.local.example` → `.env.local` rename করো

Supabase Dashboard → Settings → API থেকে নাও:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### ৫. Local-এ চালাও
```bash
npm install
npm run dev
```
http://localhost:3000

### ৬. Vercel-এ Deploy করো
1. GitHub-এ push করো
2. vercel.com → New Project → Import করো
3. Environment Variables add করো (same as .env.local)
4. Deploy!

### ৭. Admin Panel
`/admin` → email + password দিয়ে login করো

---

## Pages
- `/` — Homepage (hero, featured members, notices, gallery preview)
- `/members` — সব member-দের প্রোফাইল
- `/gallery` — ছবির গ্যালারি (lightbox সহ)
- `/notices` — নোটিশ বোর্ড
- `/admin` — Admin login
- `/admin/dashboard` — Dashboard
- `/admin/members` — Member CRUD (ছবি আপলোড সহ)
- `/admin/gallery` — Gallery CRUD
- `/admin/notices` — Notice CRUD
