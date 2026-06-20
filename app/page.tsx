import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userRows = await query<{ display_name: string }>(
    "SELECT display_name FROM users WHERE id = $1",
    [session.userId]
  );
  const displayName = userRows[0]?.display_name || "Maker";

  const projects = await query(
    `SELECT id, title, category, status, description, total_cost, material_count
     FROM project_costs
     WHERE user_id = $1
     ORDER BY project_id DESC`,
    [session.userId]
  );

  const totalSpend = projects.reduce((sum: number, p: any) => sum + parseFloat(p.total_cost), 0);
  const activeCount = projects.filter((p: any) => p.status === "in_progress").length;

  return (
    <>
      <Header displayName={displayName} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1">Your bench</h1>
            <p className="text-sm text-muted">
              {projects.length} project{projects.length !== 1 ? "s" : ""} · {activeCount} in progress · ${totalSpend.toFixed(2)} total spend
            </p>
          </div>
          <Link
            href="/projects/new"
            className="bg-rust text-paper font-medium px-4 py-2 rounded-sm hover:bg-ink transition-colors"
          >
            + New project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="border border-dashed border-grid-line rounded-sm p-12 text-center">
            <p className="font-display text-lg mb-2">Nothing on the bench yet</p>
            <p className="text-sm text-muted mb-6">
              Log your first project to start tracking materials and costs.
            </p>
            <Link
              href="/projects/new"
              className="inline-block bg-ink text-paper font-medium px-4 py-2 rounded-sm hover:bg-rust transition-colors"
            >
              Start a project
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
