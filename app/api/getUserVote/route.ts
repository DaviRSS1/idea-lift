import { supabase } from "@/app/_lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const suggestionId = searchParams.get("suggestionId");
  const userId = searchParams.get("userId");

  if (!suggestionId || !userId) {
    return NextResponse.json({ error: "Parâmetros ausentes" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("suggestion_votes")
    .select("vote")
    .eq("suggestion_id", suggestionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar voto:", error);
    return NextResponse.json(
      { error: "Erro no banco de dados" },
      { status: 500 },
    );
  }

  return NextResponse.json({ vote: data?.vote ?? 0 });
}
