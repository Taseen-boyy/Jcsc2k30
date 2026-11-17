import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "JCSC 2K30 — Jamalpur Collectorate School & College",
  description:
    "SSC Batch 2030 — Jamalpur Collectorate School & College. আমাদের ব্যাচের স্মৃতি, সাফল্য এবং বন্ধুত্বের ওয়েবসাইট।",
  openGraph: {
    title: "JCSC 2K30",
    description: "SSC Batch 2030 — Jamalpur Collectorate School & College",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#030e2e] text-white antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0a2d6e",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
