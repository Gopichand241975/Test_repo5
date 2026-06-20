"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PriceTag } from "@/components/PriceTag";
import { StatusBadge } from "@/components/StatusBadge";

type Project = {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string | null;
};

type Material = {
  id: string;
  name: string;
  quantity: string | number;
  unit: string | null;
  unit_cost: string | number;
  line_total: string | number;
};

const STATUSES = [
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "abandoned", label: "Shelved" },
];

export function ProjectDetailClient({
  project,
  initialMaterials,
}: {
  project: Project;
  initialMaterials: Material[];
}) {
  const router = useRouter();
  const [materials, setMaterials] = useState(initialMaterials);
  const [status, setStatus] = useState(project.status);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [adding, setAdding] = useState(false);

  const total = materials.reduce((sum, m) => sum + parseFloat(String(m.line_total)), 0);

  async function addMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setAdding(true);
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        name,
        quantity: parseFloat(quantity) || 1,
        unit: unit || null,
        unitCost: parseFloat(unitCost) || 0,
      }),
    });
    setAdding(false);
    if (res.ok) {
      const data = await res.json();
      const qty = parseFloat(quantity) || 1;
      const cost = parseFloat(unitCost) || 0;
      setMaterials([...materials, { ...data.material, line_total: qty * cost }]);
      setName("");
      setQuantity("1");
      setUnit("");
      setUnitCost("");
    }
  }

  async function deleteMaterial(id: string) {
    setMaterials(materials.filter((m) => m.id !== id));
    await fetch(`/api/materials/${id}`, { method: "DELETE" });
  }

  async function updateStatus(newStatus: string) {
    setStatus(newStatus);
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  async function deleteProject() {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted mb-1">{project.category}</p>
          <h1 className="font-display font-bold text-3xl">{project.title}</h1>
        </div>
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          className="border border-ink/20 rounded-sm px-2 py-1 text-sm bg-paper"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {project.description ? (
        <p className="text-ink/70 mb-8 max-w-xl">{project.description}</p>
      ) : (
        <div className="mb-8" />
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg">Materials</h2>
        <PriceTag amount={total} />
      </div>

      <div className="bg-surface border border-ink/10 rounded-sm overflow-hidden mb-6">
        {materials.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">No materials logged yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-grid-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-2 font-medium">Material</th>
                <th className="px-4 py-2 font-medium">Qty</th>
                <th className="px-4 py-2 font-medium">Unit cost</th>
                <th className="px-4 py-2 font-medium text-right">Total</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className="border-b border-grid-line last:border-0">
                  <td className="px-4 py-2.5">{m.name}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">
                    {m.quantity}
                    {m.unit ? ` ${m.unit}` : ""}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs">${parseFloat(String(m.unit_cost)).toFixed(2)}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-right">
                    ${parseFloat(String(m.line_total)).toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => deleteMaterial(m.id)}
                      className="text-muted hover:text-rust text-xs"
                      aria-label={`Remove ${m.name}`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <form
        onSubmit={addMaterial}
        className="bg-surface border border-dashed border-grid-line rounded-sm p-4 flex flex-wrap gap-3 items-end mb-10"
      >
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs uppercase tracking-wide text-muted mb-1">Material</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-ink/20 rounded-sm px-2 py-1.5 bg-paper text-sm focus:outline-none focus:border-rust"
            placeholder="Walnut boards"
          />
        </div>
        <div className="w-20">
          <label className="block text-xs uppercase tracking-wide text-muted mb-1">Qty</label>
          <input
            type="number"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border border-ink/20 rounded-sm px-2 py-1.5 bg-paper text-sm focus:outline-none focus:border-rust"
          />
        </div>
        <div className="w-24">
          <label className="block text-xs uppercase tracking-wide text-muted mb-1">Unit</label>
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border border-ink/20 rounded-sm px-2 py-1.5 bg-paper text-sm focus:outline-none focus:border-rust"
            placeholder="sheets"
          />
        </div>
        <div className="w-28">
          <label className="block text-xs uppercase tracking-wide text-muted mb-1">Unit cost</label>
          <input
            type="number"
            step="any"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            className="w-full border border-ink/20 rounded-sm px-2 py-1.5 bg-paper text-sm focus:outline-none focus:border-rust"
            placeholder="0.00"
          />
        </div>
        <button
          type="submit"
          disabled={adding || !name}
          className="bg-ink text-paper text-sm font-medium px-4 py-1.5 rounded-sm hover:bg-rust transition-colors disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add"}
        </button>
      </form>

      <button onClick={deleteProject} className="text-xs text-muted hover:text-rust underline">
        Delete this project
      </button>
    </main>
  );
}
