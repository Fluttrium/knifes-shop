import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toats/basic-toats";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ножи СПБ | Главная",
    template: "%s | Ножи СПБ",
  },
  description:
    "Бесплатная доставка по РФ. Качественные ножи и кухонные принадлежности",
  keywords: ["ножи", "кухонные ножи", "СПБ", "доставка"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen">
        <AuthProvider>
          <ToastProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  style: {
                    background: "#22c55e",
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: "#ef4444",
                  },
                },
              }}
            />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
