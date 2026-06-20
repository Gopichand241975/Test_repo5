import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  // Ownership check via join to projects.
  await query(
    `DELETE FROM materials
     WHERE id = $1
       AND project_id IN (SELECT id FROM projects WHERE user_id = $2)`,
    [id, session.userId]
  );

  return NextResponse.json({ ok: true });
}
