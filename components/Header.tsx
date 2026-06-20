"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header({ displayName }: { displayName?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b-2 border-ink/10 bg-paper/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-xl tracking-tight">
            Workbench
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-rust" />
        </Link>
        {displayName ? (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted">Signed in as {displayName}</span>
            <button
              onClick={logout}
              className="underline decoration-grid-line hover:decoration-rust transition cursor-pointer"
            >
              Log out
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
