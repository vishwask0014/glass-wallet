import connectDB from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserTokenPayloadType extends JwtPayload {
  email: string;
  userId: string;
  userName: string;
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "NO TOKEN PRESENT",
        },
        {
          status: 401,
        },
      );
    }

    const tokenPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as UserTokenPayloadType;

    const { userId } = tokenPayload;

    console.log(userId, ">>>>userId");
  } catch (error) {
    console.error("Error editing transaction:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error editing transaction",
      },
      { status: 500 },
    );
  }
}
