"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const t = useTranslations("admin");
  const [state, setState] = useState<"loading" | "login" | "authenticated">("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/check");
      if (res.ok) {
        setState("authenticated");
      } else {
        setState("login");
      }
    } catch {
      setState("login");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setState("authenticated");
        setPassword("");
      } else {
        const data = await res.json();
        setError(data.error || t("invalidPassword"));
      }
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  };

  if (state === "loading") {
    return (
      <main className="main-content">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>{t("verifying")}</p>
        </div>
      </main>
    );
  }

  if (state === "login") {
    return (
      <main className="main-content">
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          minHeight: "60vh", padding: "2rem",
        }}>
          <div style={{
            width: "100%", maxWidth: "360px", backgroundColor: "#fff",
            borderRadius: "8px", padding: "1.5rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <h1 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.25rem" }}>
                Admin Panel
              </h1>
              <p style={{ color: "#888", fontSize: "0.8rem" }}>
                {t("enterPassword")}
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password")}
                required
                autoFocus
                style={{
                  width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #ddd",
                  borderRadius: "4px", fontSize: "0.875rem", outline: "none",
                  boxSizing: "border-box",
                }}
              />

              {error && (
                <p style={{ color: "#dc3545", fontSize: "0.8rem", margin: 0 }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "0.5rem", backgroundColor: loading ? "#666" : "#111",
                  color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.875rem",
                  fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? t("loggingIn") : t("login")}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
