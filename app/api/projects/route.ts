import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await query(
    `SELECT id, title, category, status, description, total_cost, material_count
     FROM project_costs
     WHERE user_id = $1
     ORDER BY project_id DESC`,
    [session.userId]
  );

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, category, description } = await req.json();
  if (!title || !category) {
    return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
  }

  const rows = await query(
    `INSERT INTO projects (user_id, title, category, description)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, category, status, description`,
    [session.userId, title, category, description || null]
  );

  return NextResponse.json({ project: rows[0] }, { status: 201 });
}
