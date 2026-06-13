// /app/api/profile/route.ts
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface TokenPayload extends JwtPayload {
  email: string;
  userId: string;
  userName: string;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token is missing" },
      { status: 401 },
    );
  }

  console.log(token, ">>>>token checking profile");

  try {
    await connectDB();

    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as TokenPayload;

    // Fetch fresh user data from DB so we always get the correct `name`
    // regardless of what was baked into the token.
    const dbUser = (await User.findById(verifiedToken.userId).lean()) as {
      _id: { toString(): string };
      name: string;
      email: string;
    } | null;

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        userName: dbUser.name,
        // email: dbUser.email,
        // userId: dbUser._id.toString(),
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
