import { ChatMessage } from "@/app/types/common";
import { ArrowRight, Plus, Search } from "lucide-react";

type ChatThread = {
  id: string;
  title: string;
  preview: string;
  date: string;
  messageCount: number;
  active?: boolean;
};

const CHAT_THREADS: ChatThread[] = [
  {
    id: "weekend-spend",
    title: "Weekend spending review",
    preview: "Why does spending spike on Friday and Saturday?",
    date: "Jun 14",
    messageCount: 3,
    active: true,
  },
  {
    id: "salary-plan",
    title: "Payday plan",
    preview: "Help me split monthly income into useful buckets.",
    date: "Jun 13",
    messageCount: 3,
  },
  {
    id: "food-routine",
    title: "Food delivery habits",
    preview: "Tracking snack and delivery patterns.",
    date: "Jun 12",
    messageCount: 1,
  },
];

export default function HistoryAside() {
  return (
    <>
      <aside className="glass-card flex min-h-[16rem] flex-col overflow-hidden rounded-[1.75rem] p-4 lg:min-h-0">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Chat history</p>
            <p className="theme-text-soft text-xs">Previous sessions</p>
          </div>
          <button
            type="button"
            disabled
            title="Available when AI is connected"
            className="theme-button-secondary inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold opacity-60"
          >
            <Plus size={14} />
            New
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-3 shrink-0">
          <Search
            size={15}
            className="theme-text-soft pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            disabled
            placeholder="Search chats"
            className="!ps-9 text-sm opacity-70"
          />
        </div>

        {/* Thread list */}
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-0.5">
          {CHAT_THREADS.map((thread) => (
            <button
              key={thread.id}
              type="button"
              className={`w-full rounded-[1.2rem] border px-3 py-3 text-left transition hover:bg-white/12 ${
                thread.active
                  ? "border-white/30 bg-white/18 shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
                  : "border-white/10 bg-white/6"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {thread.title}
                  </p>
                  <p className="theme-text-soft mt-1 line-clamp-2 text-xs leading-5">
                    {thread.preview}
                  </p>
                </div>
                {thread.active && (
                  <ArrowRight
                    size={14}
                    className="theme-text-soft mt-0.5 shrink-0"
                  />
                )}
              </div>
              <div className="theme-text-soft mt-2 flex items-center justify-between text-[0.68rem]">
                <span>{thread.messageCount} messages</span>
                <span>{thread.date}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
