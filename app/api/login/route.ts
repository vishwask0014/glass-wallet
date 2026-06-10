import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function GenerateJWSToken(email: string, userName: string, userId: string) {
    const jwtToken = jwt.sign(
        { email: email, userId: userId, userName },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );
    return jwtToken;
}


export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        // Login form only sends email + password, so we should not require userName here.
        const { email, password }: { email: string; password: string } = body;

        const isUserFound = await User.findOne({ email });

        // If user not found
        if (!isUserFound) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Compare plain password with hashed password from DB
        const isPasswordValid = await bcrypt.compare(password, isUserFound.password);

        // If invalid password
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid password" },
                { status: 401 }
            );
        }

        // console.log(isUserFound)

        // Now runs only if password is valid
        // Mongo schema uses `name` (not `userName`).
        const jwtToken = GenerateJWSToken(
            email,
            isUserFound.name,
            isUserFound._id.toString()
        );

        const response = NextResponse.json({
            success: true,
            message: "successful login",
            token: jwtToken
        });

        // store jwtoken in the cache
        response.cookies.set("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // expire after 7 days
            path: "/",
        });

        return response;


    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unable to complete login";
        console.error("ERROR =>", error);

        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}
