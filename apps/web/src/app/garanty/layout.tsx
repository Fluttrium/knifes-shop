import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export const metadata: Metadata = {
  title: 'Ножи СПБ | О Компании',
};

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <main className="min-h-screen">
      <Suspense>
        <Header />
      </Suspense>
      {children}
      <Suspense>
        <Footer />
      </Suspense>
    </main>
  );
}
