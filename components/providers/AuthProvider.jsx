"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authClient, fetchJwtToken } from "@/lib/auth-client";
import { setToken } from "@/lib/api";
import { DASHBOARD_HOME } from "@/lib/constants";

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await authClient.getSession();
        if (cancelled) return;
        if (data?.user) {
          setUser(data.user);
          const token = await fetchJwtToken();
          if (!cancelled && token) setToken(token);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signUp = useCallback(
    async ({ name, email, password, role }) => {
      const { data, error } = await authClient.signUp.email({ name, email, password, role });
      if (error) return { ok: false, message: error.message || "Sign up failed" };
      const sessionUser = data?.user;
      if (sessionUser) setUser(sessionUser);
      const token = await fetchJwtToken();
      if (token) setToken(token);
      return { ok: true, user: sessionUser };
    },
    []
  );

  const signIn = useCallback(
    async ({ email, password }) => {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) return { ok: false, message: error.message || "Invalid email or password" };
      const sessionUser = data?.user;
      if (sessionUser) setUser(sessionUser);
      const token = await fetchJwtToken();
      if (token) setToken(token);
      return { ok: true, user: sessionUser };
    },
    []
  );


  const signInSocial = useCallback(async (provider, callbackURL = "/") => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const toAbsolute = (path) => {
      if (!path) return origin || "/";
      // Already absolute (or protocol-relative) — leave it alone.
      if (/^(https?:)?\/\//.test(path)) return path;
      try {
        return new URL(path, origin || "http://localhost:3000").toString();
      } catch {
        return origin || "/";
      }
    };

    const { data, error } = await authClient.signIn.social({
      provider,
      callbackURL: toAbsolute(callbackURL),
      errorCallbackURL: toAbsolute("/sign-in?error=social"),
      newUserCallbackURL: toAbsolute(callbackURL),
    });
    if (error) return { ok: false, message: error.message || `${provider} sign-in failed` };
    if (data?.url) {

      window.location.assign(data.url);
    }
    return { ok: true, redirecting: true };
  }, []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    setUser(null);
    setToken(null);
  }, []);


  const applyUserUpdate = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const dashboardHome = useCallback(
    (u) => (u?.role && DASHBOARD_HOME[u.role]) || "/",
    []
  );

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signInSocial, signOut, applyUserUpdate, dashboardHome }),
    [user, loading, signIn, signUp, signInSocial, signOut, applyUserUpdate, dashboardHome]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
