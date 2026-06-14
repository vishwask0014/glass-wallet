"use client";

import { useEffect, useMemo, useState } from "react";
import { Info, Loader, Plus, Search, X } from "lucide-react";
import CreateTransactionModal from "./components/CreateTransactionModal";
import EditTransactionModal from "./components/EditTransactionModal";
import type { TransactionRecord } from "@/app/types/common";

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] =
    useState(false);
  const [transcation, setTranscation] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debitNcreditFilter, setDebitNcreditFilter] = useState("");
  const [editTransaction, setEditTransaction] = useState<TransactionRecord | null>(
    null,
  );

  async function getTransactions() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/transaction/trackexpense");
      const data = await res.json();
      setTranscation(data.transcation || []);
    } catch (error) {
      console.error("not able to fetch transcation details", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transcation.filter((item) => {
      const searchMatched =
        !searchText ||
        JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase());

      const typeMatched =
        !debitNcreditFilter || item.type === debitNcreditFilter;

      console.log(!searchText, typeMatched);

      return searchMatched && typeMatched;
    });
  }, [transcation, searchText, debitNcreditFilter]);

  function clearAllFilters() {
    setSearchText("");
    setDebitNcreditFilter("");
  }

  if (isLoading) {
    return (
      <div className="page-shell py-6 sm:py-10">
        <div className="flex justify-center items-center h-screen">
          <Loader size={24} className="animate-spin" />
        </div>
      </div>
    );
  }

  // check is 24 hr pasted from the transcation createAt date
  function is24hrPassed(createAt: string) {
    const currentData = new Date().getTime();
    const txnDate = new Date(createAt).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return currentData - txnDate > twentyFourHours;
  }

  return (
    <div className="page-shell py-6 sm:py-10">
      {showModal && (
        <CreateTransactionModal onClose={() => setShowModal(false)} />
      )}

      {showEditTransactionModal && editTransaction && (
        <EditTransactionModal
          key={editTransaction._id}
          transaction={editTransaction}
          onClose={() => {
            setShowEditTransactionModal(false);
            setEditTransaction(null);
          }}
          onSaved={getTransactions}
        />
      )}

      <section className="glass-card-strong rounded-4xl p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-2 justify-between w-full">
            <div className="theme-chip rounded-full px-4 py-2 text-sm font-semibold">
              {filteredTransactions.length} entries
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="theme-button-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-xl"
            >
              <Plus size={15} />
              Add transaction
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 glass-card rounded-4xl p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr]">
          {/* GLOBAL SEARCH */}
          <div className="relative">
            <Search
              size={17}
              className="theme-text-soft pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            />

            <input
              placeholder="What you are looking for..."
              className="!ps-10"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* CREDIT / DEBIT FILTER */}
          <div className="relative flex theme-chip overflow-hidden !h-fit rounded-full w-fit justify-center items-center text-sm font-semibold">
            <div
              onClick={() =>
                setDebitNcreditFilter(
                  debitNcreditFilter === "credit" ? "" : "credit",
                )
              }
              className={`px-6 py-4 border-r border-white/10 cursor-pointer hover:bg-green-50/5 ${
                debitNcreditFilter === "credit"
                  ? "bg-green-50/10 !text-green-500"
                  : ""
              }`}
            >
              Credit
            </div>

            <div
              onClick={() =>
                setDebitNcreditFilter(
                  debitNcreditFilter === "debit" ? "" : "debit",
                )
              }
              className={`px-6 py-4 border-l border-white/10 cursor-pointer hover:bg-green-50/5 ${
                debitNcreditFilter === "debit"
                  ? "bg-green-50/10 !text-green-500"
                  : ""
              }`}
            >
              Debit
            </div>
          </div>

          {/* CLEAR FILTER */}
          <div
            onClick={clearAllFilters}
            className="theme-button-secondary flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-xl w-fit justify-center cursor-pointer"
          >
            <X size={15} />
            Clear Filter
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="mt-5 space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10">
              <p className="theme-text-muted">
                No transaction found matching current filters
              </p>
            </div>
          ) : (
            filteredTransactions.map((row, index) => (
              <article
                key={`${row.userId}-${index}`}
                className="glass-card rounded-[1.45rem] px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex gap-3 items-center">
                      <p className="theme-text font-semibold">{row.merchant}</p>

                      {"•"}

                      <div className="flex gap-2 items-center">
                        <span className="theme-text-soft mt-1 text-sm">
                          {row.category}
                        </span>
                        {"•"}
                        <span className="theme-text-soft mt-1 text-sm">
                          {row.createAt}
                        </span>
                      </div>
                    </div>

                    <p className="theme-text-soft mt-1 text-sm">{row.note}</p>
                  </div>

                  <div className="flex flex-col gap-3 items-end">
                    <p
                      className={`text-lg font-semibold tracking-[-0.04em] ${
                        row.type === "credit"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      ₹{row.amount}
                    </p>

                    {is24hrPassed(row.createAt) && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditTransaction(row);
                          setShowEditTransactionModal(true);
                        }}
                        className="theme-button-secondary flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-xl w-fit justify-center cursor-pointer"
                      >
                        Edit
                        <span
                          className="group/info relative inline-flex"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <Info
                            size={15}
                            className="theme-text-soft cursor-help"
                            aria-label="Edit button will disappear after 24 hours."
                          />
                          <span
                            role="tooltip"
                            className="theme-chip !bg-white !text-black pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-48 -translate-x-1/2 rounded-xl px-3 py-2 text-center text-xs font-normal opacity-0 shadow-lg transition-opacity group-hover/info:opacity-100 group-focus-within/info:opacity-100"
                          >
                            Edit button will disappear after 24 hours.
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
