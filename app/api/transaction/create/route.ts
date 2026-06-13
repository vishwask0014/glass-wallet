import connectDB from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import Transcation from "@/app/models/Transaction";

interface UserTokenPayloadType extends JwtPayload {
  name: string;
  email: string;
  userId: string;
}

interface TransactionPayload {
  name: string; // owner name
  userId: string; // owner userId or uId
  type: string; // debt or credit
  amount: number; // money spend
  category: string; // food, travel, shopping, investment and salary
  createAt: string; // txn time and date
  note: string; // optinal description for spending amount
  merchant: string;
}

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
    let userPayload: UserTokenPayloadType;

    try {
      userPayload = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as UserTokenPayloadType;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired token" },
        { status: 401 },
      );
    }

    // PAYLOAD DATA OF USER
    const { name, email, userId } = userPayload;
    console.log(userId, ">>>>userid");

    // EXTRACT BODY DATA
    const body: TransactionPayload = await request.json();
    const { amount, category, createAt, note, type, merchant } = body;

    console.log(body, ">>>>body in route");

    //  NEW TRANSCATION CRAETED
    const newTransaction = await Transcation.create({
      name,
      userId,
      amount,
      type,
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
