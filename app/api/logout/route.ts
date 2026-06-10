import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const response = NextResponse.json({
            success: true,
            message: "successful logout",

        })


         response.cookies.set("token", '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0,
            path: "/",
        })

        return response

    } catch (error) {
        console.error('not able to logout:', error)
    }
}