import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a personal finance assistant for Glass Wallet. Help users understand spending habits, budgets, saving goals, and weekly planning. Keep answers concise, practical, and friendly.`;

type ChatPayloadMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "AI is not configured." },
        { status: 503 },
      );
    }

    const body = await request.json();
    const messages = body.messages as ChatPayloadMessage[] | undefined;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Messages are required." },
        { status: 400 },
      );
    }

    const groq = new Groq({ apiKey });

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const content = chatCompletion.choices[0]?.message?.content?.trim() ?? "";

    if (!content) {
      return NextResponse.json(
        { success: false, message: "AI returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get AI response." },
      { status: 500 },
    );
  }
}
