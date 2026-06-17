import connectDB from "@/app/lib/mongodb";
import { serializeProfileUser } from "@/app/lib/profile";
import User from "@/app/models/User";
import Transcation from "@/app/models/Transaction";
import type { UserTokenPayload } from "@/app/types/common";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "NO TOKEN PRESENT" },
        { status: 401 },
      );
    }

    let userPayload: UserTokenPayload;

    try {
      userPayload = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as UserTokenPayload;
    } catch {
      return NextResponse.json(
        { success: false, message: "TOKEN NOT VALID" },
        { status: 401 },
      );
    }

    await connectDB();

    const [dbUser, transactions] = await Promise.all([
      User.findById(userPayload.userId),
      Transcation.find({ userId: userPayload.userId }).sort({ _id: -1 }).lean(),
    ]);

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const profile = serializeProfileUser(dbUser);

    return NextResponse.json(
      {
        success: true,
        user: profile,
        transcation: transactions.map((txn) => ({
          ...txn,
          _id: txn._id.toString(),
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to load dashboard data", error);
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard data" },
      { status: 500 },
    );
  }
}
