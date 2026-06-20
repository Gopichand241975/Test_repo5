import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password, displayName } = await req.json();

  if (!email || !password || !displayName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.length > 0) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const rows = await query<{ id: string }>(
    "INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id",
    [email, passwordHash, displayName]
  );

  await createSession(rows[0].id);
  return NextResponse.json({ ok: true });
}
