"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Modal from "@/app/Components/common/Modal";
import Button from "@/app/Components/common/Button";
import { useState } from "react";
import toast from "react-hot-toast";
import DateFormat from "@/app/Components/common/DateFormat";
import type { TransactionRecord } from "@/app/types/common";

const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Investment",
  "Salary",
  "Utilities",
  "Bills",
  "Gadgets",
  "Entertainment",
  "Other",
];

interface EditTransactionModalProps {
  onClose: () => void;
  transaction: TransactionRecord;
  onSaved?: () => void;
}

function toDatetimeLocalValue(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const pad = (part: number) => String(part).padStart(2, "0");

  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
}

export default function EditTransactionModal({
  onClose,
  transaction,
  onSaved,
}: EditTransactionModalProps) {
  const [type, setType] = useState<string>(transaction.type);
  const [amount, setAmount] = useState<number>(transaction.amount);
  const [category, setCategory] = useState<string>(transaction.category);
  const [date, setDate] = useState<string>(() =>
    toDatetimeLocalValue(transaction.createAt),
  );
  const [note, setNote] = useState<string>(transaction.note ?? "");
  const [merchant, setMerchant] = useState<string>(transaction.merchant);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!type || !category || !date || !merchant || amount <= 0) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/transaction/edit", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          transactionId: transaction._id,
          type,
          amount,
          category,
          createAt: DateFormat(date),
          note,
          merchant,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Transaction updated successfully", {
          style: {
            background: "green",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
          },
          duration: 5000,
        });
        onSaved?.();
        onClose();
        return;
      }

      toast.error(data.message || "Not able to edit transaction", {
        style: {
          background: "red",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
        },
        duration: 5000,
      });
    } catch (error) {
      console.error("Error editing transaction", error);
      toast.error("Not able to edit transaction", {
        style: {
          background: "red",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
        },
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      kicker="Update entry"
      title="Edit transaction"
      widthSize="xlarge"
    >
      <form
        className="space-y-4 grid grid-cols-2 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <p className="theme-text-muted mb-2 text-sm font-semibold tracking-[-0.01em]">
            Type
          </p>
          <div className="grid grid-cols-2 gap-2">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="edit-type"
                value="debit"
                checked={type === "debit"}
                onChange={(e) => setType(e.target.value)}
                className="sr-only"
              />
              <span
                className={`theme-button-secondary flex items-center justify-center gap-2 rounded-[1.15rem] px-4 py-3 text-sm font-semibold has-[:checked]:theme-button-primary ${type === "debit" ? "!border-white text-black" : ""}`}
              >
                <ArrowUpRight size={16} />
                Debit
              </span>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="edit-type"
                value="credit"
                checked={type === "credit"}
                onChange={(e) => setType(e.target.value)}
                className="sr-only"
              />
              <span
                className={`theme-button-secondary flex items-center justify-center gap-2 rounded-[1.15rem] px-4 py-3 text-sm font-semibold has-[:checked]:theme-button-primary ${type === "credit" ? "!border-white text-black" : ""}`}
              >
                <ArrowDownLeft size={16} />
                Credit
              </span>
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="edit-txn-amount"
            className="theme-text-muted mb-2 block text-sm font-semibold tracking-[-0.01em]"
          >
            Amount
          </label>
          <input
            id="edit-txn-amount"
            type="number"
            placeholder="Enter amount"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div>
          <label
            htmlFor="edit-txn-merchant"
            className="theme-text-muted mb-2 block text-sm font-semibold tracking-[-0.01em]"
          >
            Merchant / Source
          </label>
          <input
            id="edit-txn-merchant"
            type="text"
            placeholder="e.g. Apple Store, Salary Deposit"
            required
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="edit-txn-category"
            className="theme-text-muted mb-2 block text-sm font-semibold tracking-[-0.01em]"
          >
            Category
          </label>
          <select
            id="edit-txn-category"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="edit-txn-date"
            className="theme-text-muted mb-2 block text-sm font-semibold tracking-[-0.01em]"
          >
            Date
          </label>
          <input
            id="edit-txn-date"
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="edit-txn-note"
            className="theme-text-muted mb-2 block text-sm font-semibold tracking-[-0.01em]"
          >
            Note <span className="theme-text-soft font-normal">(optional)</span>
          </label>
          <textarea
            id="edit-txn-note"
            rows={3}
            placeholder="Add a short description…"
            className="resize-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2 col-span-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 rounded-[1.15rem]"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 rounded-[1.15rem]"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
