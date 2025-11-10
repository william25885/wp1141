"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserIdLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/user-id-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.trim().replace(/^@/, ""),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to login with this userID.");
        return;
      }

      await signIn(data.provider, { callbackUrl: "/" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/pexels-sebastian-189349.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-slate-900/90 backdrop-blur-[2px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-12">
          <section className="flex-1 text-slate-100">
            <h1 className="text-5xl font-semibold leading-tight">
              Welcome
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Be social
              </span>
            </h1>
            <p className="mt-4 text-sm text-slate-300 max-w-md leading-relaxed">
              <span className="text-cyan-300"></span> 
            </p>
          </section>

          <section className="flex-1 flex justify-end w-full">
            <div className="w-full max-w-sm rounded-2xl bg-slate-950/92 border border-cyan-500/10 shadow-[0_22px_70px_rgba(0,0,0,0.9)] px-6 py-7 space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-7 rounded-full bg-cyan-400" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    </p>
                    <p className="text-sm font-medium text-slate-100">
                      Sign in 
                    </p>
                  </div>
                </div>
                <span className="text-[9px] text-slate-500">
                </span>
              </div>

              <form onSubmit={handleUserIdLogin} className="space-y-3">
                <label className="text-[10px] text-slate-400">
                  Use your
                  <span className="text-cyan-300 font-medium"> userID</span>
                </label>

                <div className="flex items-center gap-2 border-b border-slate-700/80 pb-1 focus-within:border-cyan-400/90 transition">
                  <span className="text-cyan-300 text-xs">@</span>
                  <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="yourid"
                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-50 placeholder:text-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-sm font-semibold hover:from-cyan-300 hover:to-sky-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Checking your userID..." : "Continue with userID"}
                </button>

                {error && (
                  <p className="text-[10px] text-rose-400 leading-snug">
                    {error}
                  </p>
                )}
              </form>

              <div className="flex items-center gap-3 text-[9px] text-slate-500">
                <div className="flex-1 h-px bg-slate-800" />
                <span>or sign in with</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/setup" })}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[13px] text-slate-100 hover:bg-slate-800 hover:border-cyan-400/60 transition flex items-center justify-center gap-2"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-xs font-semibold text-slate-900">
                  G
                </span>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/setup" })}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[13px] text-slate-100 hover:bg-slate-800 hover:border-cyan-400/60 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Continue with GitHub
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
