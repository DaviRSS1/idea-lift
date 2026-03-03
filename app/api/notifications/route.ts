import { NextRequest, NextResponse } from "next/server";
import { getNotifications } from "@/app/_lib/data-service";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const data = await getNotifications(Number(userId));
  return NextResponse.json(data);
}
