import connectDB from "@/app/lib/mongodb";
import { serializeProfileUser } from "@/app/lib/profile";
import User from "@/app/models/User";
import type { UserTokenPayload } from "@/app/types/common";
import jwt from "jsonwebtoken";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is missing" },
        { status: 401 },
      );
    }

    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as UserTokenPayload;

    await connectDB();

    const dbUser = await User.findById(verifiedToken.userId);

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Image file is required" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only JPG, PNG, WEBP, or GIF images are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image must be smaller than 2MB" },
        { status: 400 },
      );
    }

    const extension = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
    const fileName = `${dbUser._id.toString()}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    const filePath = path.join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    dbUser.profileImage = `/uploads/avatars/${fileName}?v=${Date.now()}`;
    await dbUser.save();

    return NextResponse.json({
      success: true,
      message: "Profile image uploaded successfully",
      user: serializeProfileUser(dbUser),
    });
  } catch (error) {
    console.error("Profile image upload error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to upload profile image" },
      { status: 500 },
    );
  }
}
