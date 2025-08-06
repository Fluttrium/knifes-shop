"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { authService, AuthState } from "@/lib/auth";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const isAdmin = useMemo(() => authService.isAdmin(), [authState.user]);

  const checkAuth = useCallback(() => authService.checkAuth(), []);

  return {
    ...authState,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    checkAuth,
    isAdmin,
  };
}
