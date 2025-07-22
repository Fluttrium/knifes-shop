"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { authService, AuthState } from "@/lib/auth";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    return await authService.login(email, password);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  const checkAuth = useCallback(async () => {
    await authService.checkAuth();
  }, []);

  const isAdmin = useMemo(() => authService.isAdmin(), [authState.user]);

  return {
    ...authState,
    login,
    logout,
    checkAuth,
    isAdmin,
  };
}
