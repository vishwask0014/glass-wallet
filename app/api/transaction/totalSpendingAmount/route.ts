import connectDB from "@/app/lib/mongodb";
import Transcation from "@/app/models/Transaction";
import type { UserTokenPayload } from "@/app/types/common";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function normalizeType(type: unknown) {
  const value = String(type ?? "")
    .trim()
    .toLowerCase();
  return value === "credit" ? "credit" : "debit";
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

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

    const { userId } = userPayload;
    const allTransactions = await Transcation.find({ userId }).lean();

    let totalDebit = 0;
    let totalCredit = 0;

    for (const txn of allTransactions) {
      const amount = Number(txn.amount) || 0;
      if (normalizeType(txn.type) === "credit") {
        totalCredit += amount;
      } else {
        totalDebit += amount;
      }
    }

    return NextResponse.json(
      {
        success: true,
        totalDebit,
        totalCredit,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("NOT ABLE TO FETCH TOTAL SPENDING AMOUNT", error);
    return NextResponse.json(
      { success: false, message: "NOT ABLE TO FETCH TOTAL SPENDING AMOUNT" },
      { status: 500 },
    );
  }
}
