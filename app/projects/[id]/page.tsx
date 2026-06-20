import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { Header } from "@/components/Header";
import { ProjectDetailClient } from "./ProjectDetailClient";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;

  const userRows = await query<{ display_name: string }>(
    "SELECT display_name FROM users WHERE id = $1",
    [session.userId]
  );

  const projectRows = await query(
    `SELECT id, title, category, status, description FROM projects WHERE id = $1 AND user_id = $2`,
    [id, session.userId]
  );
  if (projectRows.length === 0) notFound();

  const materials = await query(
    `SELECT id, name, quantity, unit, unit_cost, (quantity * unit_cost) AS line_total
     FROM materials WHERE project_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  return (
    <>
      <Header displayName={userRows[0]?.display_name} />
      <ProjectDetailClient project={projectRows[0] as any} initialMaterials={materials as any} />
    </>
  );
}
