import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const projectRows = await query(
    `SELECT id, title, category, status, description, created_at
     FROM projects WHERE id = $1 AND user_id = $2`,
    [id, session.userId]
  );
  if (projectRows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const materials = await query(
    `SELECT id, name, quantity, unit, unit_cost, (quantity * unit_cost) AS line_total
     FROM materials WHERE project_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  return NextResponse.json({ project: projectRows[0], materials });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { title, category, status, description } = await req.json();

  const rows = await query(
    `UPDATE projects
     SET title = COALESCE($1, title),
         category = COALESCE($2, category),
         status = COALESCE($3, status),
         description = COALESCE($4, description),
         updated_at = now()
     WHERE id = $5 AND user_id = $6
     RETURNING id, title, category, status, description`,
    [title, category, status, description, id, session.userId]
  );

  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project: rows[0] });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  await query("DELETE FROM projects WHERE id = $1 AND user_id = $2", [id, session.userId]);
  return NextResponse.json({ ok: true });
}
