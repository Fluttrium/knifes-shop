"use client";

import { useEffect, useRef } from "react";
import { authService } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      authService.checkAuth();
      hasInitialized.current = true;
    }
  }, []);

  return <>{children}</>;
}
