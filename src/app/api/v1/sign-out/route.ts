import { NextResponse } from "next/server";
import { destroySession } from "@/server/auth/session";

export async function POST() {
  await destroySession();
  return new NextResponse(null, { status: 204 });
}
