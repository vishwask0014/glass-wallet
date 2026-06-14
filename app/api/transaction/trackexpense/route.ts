import connectDB from "@/app/lib/mongodb";
import Transcation from "@/app/models/Transaction";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import type { UserTokenPayload } from "@/app/types/common";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "NO TOKEN PRESENT" },
                { status: 401 }
            );
        }

        let userPayload: UserTokenPayload;

        try {
            userPayload = jwt.verify(
                token,
                process.env.JWT_SECRET!
            ) as UserTokenPayload;

            console.log(userPayload);

            const { userId } = userPayload;

            const transcation = await Transcation.find({ userId })

            console.log('transcation', transcation);

            return NextResponse.json({
                success: true,
                transcation,
            }, { status: 200 });


        } catch (e) {
            console.error("JWT verification failed in trackexpense:", e);
            return NextResponse.json(
                { success: false, message: "TOKEN NOT VALID" },
                { status: 401 }
            );
        }

        const { userId } = userPayload;
        const transactions = await Transcation.find({ userId }).sort({ createAt: -1 });

        return NextResponse.json({
            success: true,
            transactions,
        });
    } catch (error) {
        console.error("Not able to get transcation data", error);
        const message =
            error instanceof Error
                ? error.message
                : "Not able to get transcation data";

        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}
