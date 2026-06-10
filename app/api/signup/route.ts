import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

export async function POST(req: Request) {
  try {
    await mongoose.connect(MONGODB_URI);
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
