"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display font-bold text-2xl mb-1">Welcome back</h1>
          <p className="text-sm text-muted">Pick up where you left off.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-surface border border-ink/10 rounded-sm p-6 shadow-[2px_2px_0_0_var(--grid-line)]">
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-paper focus:outline-none focus:border-rust"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-paper focus:outline-none focus:border-rust"
              placeholder="Your password"
            />
          </div>

          {error ? <p className="text-sm text-rust">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper font-medium py-2.5 rounded-sm hover:bg-rust transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-sm text-center text-muted mt-6">
          No account yet?{" "}
          <Link href="/signup" className="underline hover:text-rust">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
