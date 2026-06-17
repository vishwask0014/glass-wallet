import type { JwtPayload } from "jsonwebtoken";

export type TransactionType = "debit" | "credit";

export interface UserTokenPayload extends JwtPayload {
  email: string;
  userId: string;
  userName: string;
}

export interface TransactionPayload {
  type: TransactionType;
  amount: number;
  category: string;
  createAt: string;
  note?: string;
  merchant: string;
}

export interface TransactionRecord extends TransactionPayload {
  userId: string;
  _id: string;
}

export interface UserProfile {
  userName: string;
  email: string;
  userId: string;
  region: string;
  planningStyle: string;
  monthlySalary: number | null;
  salaryUpdatedAt: string | null;
  canEditSalary: boolean;
  salaryUnlockDate: string | null;
  profileImage: string;
}

export type ChatMessage = {
  id: string;
  question: string;
  answer: string;
  time: string;
};
