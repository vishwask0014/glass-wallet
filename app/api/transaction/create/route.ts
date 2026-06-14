import connectDB from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Transcation from "@/app/models/Transaction";
import type { TransactionPayload, UserTokenPayload } from "@/app/types/common";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // STEP 1: GET TOKEN
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token present",
        },
        { status: 401 },
      );
    }

    // STEP 2: VERIFY TOKEN
    let userPayload: UserTokenPayload;

    try {
      userPayload = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as UserTokenPayload;
    } catch {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired token" },
        { status: 401 },
      );
    }

    // PAYLOAD DATA OF USER
    const { userId } = userPayload;
    console.log(userId, ">>>>userid");

    // EXTRACT BODY DATA
    const body: TransactionPayload = await request.json();
    const { amount, category, createAt, note, type, merchant } = body;
    const normalizedType =
      type?.trim().toLowerCase() === "credit" ? "credit" : "debit";

    await Transcation.create({
      userId,
      amount,
      type: normalizedType,
      category,
      createAt,
      merchant,
      note,
    });

    //  RETURN RESPONSE
    return NextResponse.json(
      {
        success: true,
        message: "transaction created successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("Transaction POST error =>", error);

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
