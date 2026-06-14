import connectDB from "@/app/lib/mongodb";
import { canEditSalary, serializeProfileUser } from "@/app/lib/profile";
import User from "@/app/models/User";
import type { UserTokenPayload } from "@/app/types/common";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import type { Document } from "mongoose";

type DbUser = Document & {
  _id: { toString(): string };
  name: string;
  email: string;
  region?: string;
  planningStyle?: string;
  monthlySalary?: number | null;
  salaryUpdatedAt?: Date | null;
  profileImage?: string;
};

async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return {
      error: NextResponse.json(
        { success: false, message: "Token is missing" },
        { status: 401 },
      ),
    };
  }

  try {
    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as UserTokenPayload;

    await connectDB();

    const dbUser = (await User.findById(verifiedToken.userId)) as DbUser | null;

    if (!dbUser) {
      return {
        error: NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 },
        ),
      };
    }

    return { dbUser };
  } catch {
    return {
      error: NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      ),
    };
  }
}

export async function GET(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (auth.error) {
    return auth.error;
  }

  return NextResponse.json({
    success: true,
    user: serializeProfileUser(auth.dbUser),
  });
}

interface UpdateProfileBody {
  region?: string;
  planningStyle?: string;
  monthlySalary?: number | null;
}

export async function PUT(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (auth.error) {
    return auth.error;
  }

  const { dbUser } = auth;
  const body = (await request.json()) as UpdateProfileBody;

  if (typeof body.region === "string") {
    dbUser.region = body.region.trim();
  }

  if (typeof body.planningStyle === "string") {
    dbUser.planningStyle = body.planningStyle.trim();
  }

  if (body.monthlySalary !== undefined) {
    const nextSalary =
      body.monthlySalary === null ? null : Number(body.monthlySalary);

    if (nextSalary !== null && (Number.isNaN(nextSalary) || nextSalary < 0)) {
      return NextResponse.json(
        { success: false, message: "Salary must be a valid positive number" },
        { status: 400 },
      );
    }

    const currentSalary =
      typeof dbUser.monthlySalary === "number" ? dbUser.monthlySalary : null;

    if (nextSalary !== currentSalary) {
      if (!canEditSalary(dbUser.salaryUpdatedAt)) {
        return NextResponse.json(
          {
            success: false,
            message: "Salary can only be updated once every 2 months",
            user: serializeProfileUser(dbUser),
          },
          { status: 403 },
        );
      }

      dbUser.monthlySalary = nextSalary;
      dbUser.salaryUpdatedAt = new Date();
    }
  }

  await dbUser.save();

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully",
    user: serializeProfileUser(dbUser),
  });
}
