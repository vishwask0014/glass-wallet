import connectDB from "./mongodb";
import type { TransactionPayload, UserTokenPayload } from "../types/common";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Transcation from "../models/Transaction";
import User from "../models/User";
import Groq from "groq-sdk";

export const AI_ANALYSIS_CACHE_DAYS = 7;
export const AI_ANALYSIS_CACHE_MS =
  AI_ANALYSIS_CACHE_DAYS * 24 * 60 * 60 * 1000;

export type FinanceAnalysisData = {
  totalSpent: number;
  transactionCount: number;
  weekendSpendPercent: number;
  avgPerTransaction: number;
  summary: string;
  topSpendingCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  insights: string[];
  suggestions: string[];
  weeklyPlan: string;
  savingsOpportunity: number;
};

export type AIsuggestionResult =
  | {
      success: true;
      analysis: FinanceAnalysisData;
      updatedAt: string;
      fromCache: boolean;
      nextRefreshAt: string;
    }
  | { success: false; message: string };

export const FINANCE_SYSTEM_PROMPT = `
You are GlassWallet AI — a personal finance analyst for Indian users.

## YOUR ONLY JOB
Analyze the JSON transaction array the user sends and return a SINGLE valid JSON object. No markdown. No explanation. No extra text. Just the JSON.

## INPUT FORMAT
You will receive an array of transaction objects with these fields:
- type: "debit" | "credit"
- amount: number (in ₹)
- category: string (Bills, Food, Entertainment, Travel, Shopping, Utilities, Investment, Other, Salary, etc.)
- createAt: ISO date string
- note: string
- merchant: string

## STRICT CALCULATION RULES
1. ONLY include "debit" transactions in spending analysis. NEVER include "credit" in totals or category breakdowns.
2. totalSpent = sum of ALL debit transaction amounts
3. For topSpendingCategories: group debits by category, sum each group, sort descending by amount, return top 4
4. percentage = (categoryAmount / totalSpent * 100), rounded to 1 decimal
5. savingsOpportunity = realistic monthly reduction achievable from suggestions (integer, in ₹)
6. weekendSpendPercent = (sum of debits on Saturday/Sunday) / totalSpent * 100, rounded to 1 decimal

## OUTPUT SCHEMA — return EXACTLY this shape, nothing else:
{
  "totalSpent": number,
  "transactionCount": number,
  "weekendSpendPercent": number,
  "avgPerTransaction": number,
  "summary": "2–3 sentences. Mention totalSpent, top category, and one notable pattern.",
  "topSpendingCategories": [
    { "category": "string", "amount": number, "percentage": number }
  ],
  "insights": [
    "Insight referencing a specific merchant or amount from the data",
    "Insight about timing pattern (weekend/weekday, frequency)",
    "Insight comparing a category to a typical benchmark"
  ],
  "suggestions": [
    "Specific saving action mentioning the merchant/category + estimated ₹ saved per month",
    "Second suggestion with ₹ estimate",
    "Third suggestion with ₹ estimate"
  ],
  "weeklyPlan": "3 concrete steps: how much to allocate to essentials, discretionary, and savings per week based on this data.",
  "savingsOpportunity": number
}

## RULES
- All amounts in ₹, integers only (no decimals on amounts)
- insights array: exactly 3 strings
- suggestions array: exactly 3 strings, ordered by highest ₹ saving first
- topSpendingCategories array: exactly 4 items (merge small categories into "Other" if needed)
- avgPerTransaction = totalSpent / transactionCount, rounded to nearest integer
- Never mention credit transactions in insights or suggestions
- Never add fields outside the schema above
`.trim();

function toTransactionPayload(txn: {
  type?: string;
  amount?: number;
  category?: string;
  createAt?: string;
  note?: string;
  merchant?: string;
}): TransactionPayload {
  return {
    type: txn.type === "credit" ? "credit" : "debit",
    amount: Number(txn.amount ?? 0),
    category: String(txn.category ?? "Other"),
    createAt: String(txn.createAt ?? ""),
    note: txn.note ? String(txn.note) : undefined,
    merchant: String(txn.merchant ?? "Unknown"),
  };
}

function parseAnalysisJson(raw: string): FinanceAnalysisData {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned) as FinanceAnalysisData;
}

function getNextRefreshAt(updatedAt: Date) {
  return new Date(updatedAt.getTime() + AI_ANALYSIS_CACHE_MS);
}

function isCacheValid(updatedAt: Date | null | undefined) {
  if (!updatedAt) return false;
  return Date.now() - updatedAt.getTime() < AI_ANALYSIS_CACHE_MS;
}

async function generateAnalysis(
  userId: string,
  userName: string,
): Promise<FinanceAnalysisData> {
  const rawTransactions = await Transcation.find({ userId }).lean();
  const transactions = rawTransactions.map((txn) => toTransactionPayload(txn));

  const debitTransactions = transactions.filter((t) => t.type === "debit");
  const creditTransactions = transactions.filter((t) => t.type === "credit");

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("AI is not configured.");
  }

  const groq = new Groq({ apiKey });

  const userMessage = `
Analyze these transactions for user ${userName}:

DEBITS (${debitTransactions.length} transactions — use these for all spending analysis):
${JSON.stringify(debitTransactions, null, 2)}

CREDITS (${creditTransactions.length} transactions — for context only, DO NOT include in spending totals):
${JSON.stringify(creditTransactions, null, 2)}
`.trim();

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: FINANCE_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const raw = chatCompletion.choices[0]?.message?.content?.trim() ?? "";

  if (!raw) {
    throw new Error("AI returned an empty response.");
  }

  return parseAnalysisJson(raw);
}

export async function getAiSuggestion(options: {
  userId: string;
  userName: string;
  force?: boolean;
}): Promise<AIsuggestionResult> {
  try {
    await connectDB();

    const user = await User.findById(options.userId);

    if (!user) {
      return { success: false, message: "User not found." };
    }

    const cachedAnalysis = user.aiAnalysis as FinanceAnalysisData | null;
    const updatedAt = user.aiAnalysisUpdatedAt as Date | null;

    if (!options.force && cachedAnalysis && isCacheValid(updatedAt)) {
      const cacheDate = updatedAt as Date;
      return {
        success: true,
        analysis: cachedAnalysis,
        updatedAt: cacheDate.toISOString(),
        fromCache: true,
        nextRefreshAt: getNextRefreshAt(cacheDate).toISOString(),
      };
    }

    const analysis = await generateAnalysis(options.userId, options.userName);
    const freshUpdatedAt = new Date();

    user.aiAnalysis = analysis;
    user.aiAnalysisUpdatedAt = freshUpdatedAt;
    await user.save();

    return {
      success: true,
      analysis,
      updatedAt: freshUpdatedAt.toISOString(),
      fromCache: false,
      nextRefreshAt: getNextRefreshAt(freshUpdatedAt).toISOString(),
    };
  } catch (error) {
    console.error("getAiSuggestion error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Not able to fetch AI suggestion.",
    };
  }
}

async function getAuthedUser() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as UserTokenPayload;

    return {
      userId: payload.userId,
      userName: payload.userName,
    };
  } catch {
    return null;
  }
}

export default async function AIsuggestion(
  force = false,
): Promise<AIsuggestionResult> {
  const authedUser = await getAuthedUser();

  if (!authedUser) {
    return { success: false, message: "Please log in to view AI suggestions." };
  }

  return getAiSuggestion({
    userId: authedUser.userId,
    userName: authedUser.userName,
    force,
  });
}
