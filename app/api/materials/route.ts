import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, name, quantity, unit, unitCost } = await req.json();
  if (!projectId || !name) {
    return NextResponse.json({ error: "Project and material name are required" }, { status: 400 });
  }

  // Verify the project belongs to this user before inserting.
  const owns = await query("SELECT id FROM projects WHERE id = $1 AND user_id = $2", [
    projectId,
    session.userId,
  ]);
  if (owns.length === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const rows = await query(
    `INSERT INTO materials (project_id, name, quantity, unit, unit_cost)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, quantity, unit, unit_cost`,
    [projectId, name, quantity || 1, unit || null, unitCost || 0]
  );

  return NextResponse.json({ material: rows[0] }, { status: 201 });
}
