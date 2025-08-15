import { Suspense } from "react";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen mx-3.5 flex flex-col">
      <Suspense
        fallback={<div className="h-16 bg-gray-100 animate-pulse border-b" />}
      >
        <Header />
      </Suspense>

      <main className="flex-1">{children}</main>

      <Suspense
        fallback={<div className="h-32 bg-gray-100 animate-pulse border-t" />}
      >
        <Footer />
      </Suspense>
    </div>
  );
}
