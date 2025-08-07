"use client";

import { useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/admin-components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, isAdmin, checkAuth } = useAuth();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (!hasCheckedAuth.current) {
      console.log("🔄 Dashboard layout mounted, checking auth...");
      checkAuth();
      hasCheckedAuth.current = true;
    }
  }, []); // Убираем зависимость от checkAuth

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Not authenticated, redirecting to signin
      redirect("/signin");
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      // Not admin, redirecting to home
      redirect("/");
    }
  }, [isAuthenticated, isLoading, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Проверка прав доступа...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
