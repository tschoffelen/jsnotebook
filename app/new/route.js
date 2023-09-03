import { NextResponse } from "next/server";
import { saveNotebook } from "@/lib/api/notebooks";

export async function GET() {
  const id = await saveNotebook({
    content: "",
  });

  const headers = new Headers();
  headers.set("Cache-Control", "no-store, max-age=0");

  return NextResponse.redirect(`/${id}`, { headers, status: 307 });
}
