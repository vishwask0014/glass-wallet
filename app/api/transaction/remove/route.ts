import connectDB from "@/app/lib/mongodb";
import type {
  DeleteTransactionPayload,
  UserTokenPayload,
} from "@/app/types/common";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Transcation from "@/app/models/Transaction";
import mongoose from "mongoose";

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "NO TOKEN PRESENT",
        },
        { status: 401 },
      );
    }
    let userPayload: UserTokenPayload;

    try {
      userPayload = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as UserTokenPayload;
    } catch (error) {
      console.error("JWT verification failed in remove transcation:", error);
      return NextResponse.json(
        {
          success: false,
          message: "TOKEN NOT VALID",
        },
        { status: 401 },
      );
    }

    const { userId } = userPayload;
    const { transactionId } =
      (await request.json()) as DeleteTransactionPayload;

    if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid transaction ID",
        },
        { status: 400 },
      );
    }

    const deletedTransaction = await Transcation.findOneAndDelete({
      _id: transactionId,
      userId,
    });
    if (!deletedTransaction) {
      return NextResponse.json(
        {
          success: false,
          message: "transaction not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "transaction removed successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("not able to remove transaction", error);
    return NextResponse.json(
      {
        success: false,
        message: "not able to remove transaction",
      },
      { status: 500 },
    );
  }
}
