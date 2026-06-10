"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Modal from "@/app/Components/common/Modal";
import Button from "@/app/Components/common/Button";
import { useState } from "react";

const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Investment",
  "Salary",
  "Utilities",
  "Entertainment",
  "Other",
];

interface CreateTransactionModalProps {
  onClose: () => void;
}

export default function CreateTransactionModal({
  onClose,
}: CreateTransactionModalProps) {
  const [type, setType] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [merchant, setMerchant] = useState<string>("");

  console.log(category, '>>>>category');
  

  // DATE FORMAT AND CONVERT TO 12HR TIME ZONE
  const dateFormat = (data: string) => {
    const date = new Date(data);
    const formattedDate = date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    return formattedDate;
  };

  const handleAddNew = async () => {
    try {
      const response = await fetch("api/transaction/create", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          amount: amount,
          category: category,
          createAt: dateFormat(date),
          note: note,
          merchant: merchant,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      onClose={onClose}
      kicker="New entry"
      title="Log a transaction"
      widthSize="xlarge"
    >
      <form
        className="space-y-4 grid grid-cols-2 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Type toggle */}
        <div>
          <p className="theme-text-muted mb-2 text-sm font-semibold tracking-[-0.01em]">
            Type
          </p>
          <div className="grid grid-cols-2 gap-2">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value="debit"
                onChange={(e) => setType(e.target.value)}
                className="sr-only"
                defaultChecked
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
                name="type"
                value="credit"
                className="sr-only"
                onChange={(e) => setType(e.target.value)}
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

        {/* Amount */}
        <div>
          <label
            htmlFor="txn-amount"
            className="theme-text-muted mb-2 block text-sm font-semibold tracking-[-0.01em]"
          >
            Amount
          </label>
          <input
            id="txn-amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        {/* Merchant */}
        <div>
          <label
            htmlFor="txn-merchant"
            className="theme-text-muted mb-2 block text-sm font-semibold tracking-[-0.01em]"
          >
            Merchant / Source
          </label>
          <input
            id="txn-merchant"
            type="text"
            placeholder="e.g. Apple Store, Salary Deposit"
            required
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="txn-category"
            className="theme-text-muted mb-2 block text-sm font-semibold tracking-[-0.01em]"
          >
            Category
          </label>
          <select
            id="txn-category"
            defaultValue=""
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} selected={category === cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="txn-date"
            className="theme-text-muted mb-2 block text-sm font-semibold tracking-[-0.01em]"
          >
            Date
          </label>
          <input
            id="txn-date"
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Note */}
        <div>
          <label
            htmlFor="txn-note"
            className="theme-text-muted mb-2 block text-sm font-semibold tracking-[-0.01em]"
          >
            Note <span className="theme-text-soft font-normal">(optional)</span>
          </label>
          <textarea
            id="txn-note"
            rows={3}
            placeholder="Add a short description…"
            className="resize-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 col-span-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 rounded-[1.15rem]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={handleAddNew} className="flex-1 rounded-[1.15rem]">
            Save transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
}
