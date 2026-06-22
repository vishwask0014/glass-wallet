import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { getAiSuggestion } from "@/app/lib/ai-suggestion";
import type { UserTokenPayload } from "@/app/types/common";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please log in to refresh AI suggestions." },
        { status: 401 },
      );
    }

    let payload: UserTokenPayload;

    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as UserTokenPayload;
    } catch {
      return NextResponse.json(
        { success: false, message: "Session expired. Please log in again." },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const force = body?.force === true;

    const result = await getAiSuggestion({
      userId: payload.userId,
      userName: payload.userName,
      force,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AIsuggestion route error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to refresh AI suggestion." },
      { status: 500 },
    );
  }
}
