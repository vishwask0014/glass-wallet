import connectDB from "@/app/lib/mongodb";
import Transcation from "@/app/models/Transaction";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import type { UserTokenPayload } from "@/app/types/common";

interface EditTransactionBody {
  transactionId: string;
  type: string;
  amount: number;
  category: string;
  createAt: string;
  note?: string;
  merchant: string;
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "NO TOKEN PRESENT" },
        { status: 401 },
      );
    }

    const tokenPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as UserTokenPayload;

    const { userId } = tokenPayload;
    const body: EditTransactionBody = await request.json();
    const { transactionId, amount, category, createAt, note, type, merchant } =
      body;

    if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
      return NextResponse.json(
        { success: false, message: "Invalid transaction ID" },
        { status: 400 },
      );
    }

    const updatedTransaction = await Transcation.findOneAndUpdate(
      { _id: transactionId, userId },
      { amount, category, createAt, note, type, merchant },
      { new: true },
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Transaction updated successfully",
        transaction: updatedTransaction,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error editing transaction:", error);
    return NextResponse.json(
      { success: false, message: "Error editing transaction" },
      { status: 500 },
    );
  }
}
