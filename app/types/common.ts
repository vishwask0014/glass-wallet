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
