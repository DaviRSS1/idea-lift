import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const userId = req.nextUrl.searchParams.get("userId");

  if (!q || q.length < 2) return NextResponse.json([]);

  const { data } = await supabase
    .from("projects")
    .select("id, title, description, projectIcon, status")
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    .eq("visibility", "public")
    .limit(5);

  return NextResponse.json(data ?? []);
}
