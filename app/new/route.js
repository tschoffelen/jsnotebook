import { redirect } from "next/navigation";

import { saveNotebook } from "@/lib/api/notebooks";

export async function GET() {
  const id = await saveNotebook({
    content: "",
  });

  redirect(`/${id}`);
}
