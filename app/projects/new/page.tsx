"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";

const CATEGORIES = ["Woodworking", "Knitting & textiles", "3D printing", "Electronics", "Ceramics", "Other"];

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, description }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    const data = await res.json();
    router.push(`/projects/${data.project.id}`);
    router.refresh();
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-12">
        <h1 className="font-display font-bold text-2xl mb-6">Log a new project</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-surface border border-ink/10 rounded-sm p-6 shadow-[2px_2px_0_0_var(--grid-line)]">
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-paper focus:outline-none focus:border-rust"
              placeholder="Walnut bookshelf"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-paper focus:outline-none focus:border-rust"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">
              Description <span className="normal-case text-muted/70">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-paper focus:outline-none focus:border-rust resize-none"
              placeholder="What are you making, and why?"
            />
          </div>

          {error ? <p className="text-sm text-rust">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper font-medium py-2.5 rounded-sm hover:bg-rust transition-colors disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create project"}
          </button>
        </form>
      </main>
    </>
  );
}
