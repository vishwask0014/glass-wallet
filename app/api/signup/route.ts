import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const saltRounds = 10;

    const body = await req.json();
    const { name, email, password }: { name: string; email: string; password: string } = body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      "name": name,
      "email": email,
      "password": hashedPassword
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create account";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
