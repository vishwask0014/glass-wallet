"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Brain,
  MessageCircle,
  Plus,
  Search,
  Send,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

type ChatThread = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  messages: ChatMessage[];
};

type HabitInsight = {
  title: string;
  description: string;
  score: number;
  accent: string;
};

const INITIAL_THREADS: ChatThread[] = [
  {
    id: "weekend-spend",
    title: "Weekend spending review",
    preview: "You asked why weekends feel expensive.",
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: "w1",
        role: "assistant",
        content:
          "I’m ready to help you spot spending patterns, compare weeks, and turn habits into simple plans.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "w2",
        role: "user",
        content:
          "Why does my spending always spike on Friday night and Saturday afternoon?",
        createdAt: new Date().toISOString(),
      },
      {
        id: "w3",
        role: "assistant",
        content:
          "That usually means a routine, not random spending. We can look for trigger times, frequent categories, and the places where small purchases add up.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "salary-plan",
    title: "Payday plan",
    preview: "Planning how to use salary without stress.",
    updatedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    messages: [
      {
        id: "s1",
        role: "assistant",
        content:
          "Your salary is a strong anchor point. We can build a simple plan around saving, essentials, and guilt-free spending.",
        createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      },
      {
        id: "s2",
        role: "user",
        content: "Help me split my monthly income into useful buckets.",
        createdAt: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
      },
      {
        id: "s3",
        role: "assistant",
        content:
          "A helpful split is needs, goals, and flexible spend. I can also learn your actual habits and suggest a percentage that fits your real life.",
        createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
      },
    ],
  },
  {
    id: "food-routine",
    title: "Food delivery habits",
    preview: "Tracking snack and delivery patterns.",
    updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    messages: [
      {
        id: "f1",
        role: "assistant",
        content:
          "If food delivery shows up often, we can compare it to meal times, commute days, and work pressure.",
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      },
    ],
  },
];

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function buildReply(message: string) {
  const text = message.toLowerCase();

  if (text.includes("food") || text.includes("delivery") || text.includes("coffee")) {
    return "I’m noticing a food-related habit signal. Let’s map when it happens most often, then we can suggest a weekly cap that still feels comfortable.";
  }

  if (text.includes("salary") || text.includes("payday") || text.includes("income")) {
    return "Nice, payday planning is a great habit to formalize. I can help you split income into fixed bills, saving goals, and flexible spend.";
  }

  if (text.includes("weekend") || text.includes("friday") || text.includes("saturday")) {
    return "That’s a classic pattern. Weekend spending often comes from timing and mood, so we should watch the trigger window instead of only category totals.";
  }

  if (text.includes("saving") || text.includes("save")) {
    return "Good direction. The best savings plan is one you can repeat, so let’s make the smallest consistent transfer your default habit.";
  }

  return "That’s helpful context. I’ll keep learning from your messages and use them to refine your habit summary and weekly suggestions.";
}

function buildHabitInsights(messages: ChatMessage[]): HabitInsight[] {
  const content = messages.map((message) => message.content).join(" ").toLowerCase();

  const insights: HabitInsight[] = [
  {
      title: "Weekend spend window",
      description: content.includes("weekend") || content.includes("friday")
        ? "You often mention expenses that cluster around the end of the week."
        : "Your spending habits may change around weekends, which is worth tracking.",
      score: content.includes("weekend") ? 84 : 68,
      accent: "from-cyan-400/70 to-blue-500/70",
  },
  {
      title: "Food delivery pressure",
      description: content.includes("food") || content.includes("delivery")
        ? "Food and delivery are likely repeat categories that deserve a weekly guardrail."
        : "Food categories could be a useful place to look for quick wins.",
      score: content.includes("food") || content.includes("delivery") ? 78 : 58,
      accent: "from-emerald-400/70 to-teal-500/70",
  },
  {
      title: "Payday planning",
      description: content.includes("salary") || content.includes("payday") || content.includes("income")
        ? "You already think in income buckets, which is a strong sign for structured budgeting."
        : "Income-based budgeting could help you stabilize the month ahead.",
      score: content.includes("salary") || content.includes("payday") || content.includes("income") ? 91 : 65,
      accent: "from-violet-400/70 to-fuchsia-500/70",
  },
];

  return insights;
}

export default function AIplanner() {
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(INITIAL_THREADS[0]?.id ?? "");
  const [searchHistory, setSearchHistory] = useState("");
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const thinkingTimeoutRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId],
  );

  const filteredThreads = useMemo(() => {
    const query = searchHistory.trim().toLowerCase();

    if (!query) {
      return threads;
    }

    return threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(query) ||
        thread.preview.toLowerCase().includes(query),
    );
  }, [searchHistory, threads]);

  const habitInsights = useMemo(
    () => buildHabitInsights(activeThread?.messages ?? []),
    [activeThread],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeThread?.messages.length, isThinking]);

  useEffect(() => {
    return () => {
      if (thinkingTimeoutRef.current !== null) {
        window.clearTimeout(thinkingTimeoutRef.current);
      }
    };
  }, []);

  function updateThread(threadId: string, updater: (thread: ChatThread) => ChatThread) {
    setThreads((currentThreads) =>
      currentThreads.map((thread) => (thread.id === threadId ? updater(thread) : thread)),
    );
  }

  function createNewChat() {
    const newThread: ChatThread = {
      id: makeId("thread"),
      title: "New planning chat",
      preview: "Start a fresh conversation about habits.",
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: makeId("msg"),
          role: "assistant",
          content:
            "Tell me what you want to understand about your habits, and I’ll help turn it into a simple plan.",
          createdAt: new Date().toISOString(),
        },
      ],
    };

    setThreads((currentThreads) => [newThread, ...currentThreads]);
    setActiveThreadId(newThread.id);
  }

  function handleSendMessage() {
    const content = draft.trim();
    if (!content || !activeThread) return;

    const userMessage: ChatMessage = {
      id: makeId("msg"),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setDraft("");
    setIsThinking(true);

    if (thinkingTimeoutRef.current !== null) {
      window.clearTimeout(thinkingTimeoutRef.current);
    }

    updateThread(activeThread.id, (thread) => ({
      ...thread,
      preview: content,
      updatedAt: new Date().toISOString(),
      messages: [...thread.messages, userMessage],
    }));

    thinkingTimeoutRef.current = window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: makeId("msg"),
        role: "assistant",
        content: buildReply(content),
        createdAt: new Date().toISOString(),
      };

      updateThread(activeThread.id, (thread) => ({
        ...thread,
        updatedAt: new Date().toISOString(),
        messages: [...thread.messages, assistantMessage],
      }));

      setIsThinking(false);
    }, 700);
  }

  return (
    <div className="page-shell py-6 sm:py-10">
      <section className="glass-card-strong rounded-[2rem] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 theme-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
              <Sparkles size={14} />
              AI planner
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                Chat with your money habits.
              </h1>
              <p className="theme-text-soft mt-2 max-w-3xl text-sm sm:text-base">
                Keep the conversation in the center, browse your chat history on the left,
                and learn habit patterns on the right as the planner gets smarter with every message.
              </p>
            </div>
          </div>
  
          <div className="flex flex-wrap gap-2">
            <div className="theme-chip rounded-full px-4 py-2 text-sm font-semibold">
              {threads.length} chats
            </div>
            <div className="theme-chip rounded-full px-4 py-2 text-sm font-semibold">
              {activeThread?.messages.length ?? 0} messages
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.5fr_0.95fr]">
        <aside className="glass-card rounded-[2rem] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="theme-text font-semibold">Chat history</p>
              <p className="theme-text-soft text-sm">Pick up any previous planning session.</p>
            </div>
            <button
              type="button"
              onClick={createNewChat}
              className="theme-button-secondary inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold"
            >
              <Plus size={15} />
              New
            </button>
          </div>

          <div className="relative mt-4">
            <Search
              size={16}
              className="theme-text-soft pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            />
            <input
              value={searchHistory}
              onChange={(event) => setSearchHistory(event.target.value)}
              placeholder="Search chats"
              className="!ps-10"
            />
          </div>

          <div className="mt-4 space-y-2">
            {filteredThreads.map((thread) => {
              const active = thread.id === activeThreadId;

              return (
              <button
                key={thread.id}
                type="button"
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition ${
                    active
                      ? "border-white/30 bg-white/20 shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
                      : "border-white/10 bg-white/8 hover:bg-white/14"
                }`}
              >
                  <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                      <p className="truncate font-semibold">{thread.title}</p>
                      <p className="theme-text-soft mt-1 line-clamp-2 text-sm">
                      {thread.preview}
                    </p>
                  </div>
                    <ArrowRight size={16} className="theme-text-soft mt-1 shrink-0" />
                </div>
                  <div className="theme-text-soft mt-3 flex items-center justify-between text-xs">
                    <span>{thread.messages.length} messages</span>
                    <span>{formatShortDate(thread.updatedAt)}</span>
                </div>
              </button>
              );
            })}
          </div>
        </aside>

        <main className="glass-card-strong rounded-[2rem] p-4 sm:p-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 theme-chip rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em]">
                <MessageCircle size={14} />
                Live chat
            </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                {activeThread?.title ?? "New planning chat"}
            </h2>
              <p className="theme-text-soft mt-1 text-sm">
                Ask questions about habits, budgets, patterns, or goals.
            </p>
          </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setDraft("Where do I spend the most on weekends, and what should I change?")
                }
                className="theme-button-secondary rounded-full px-4 py-2 text-sm font-semibold"
              >
                Weekend spend
              </button>
              <button
                type="button"
                onClick={() =>
                  setDraft("Can you help me build a simple payday budget I can repeat?")
                }
                className="theme-button-secondary rounded-full px-4 py-2 text-sm font-semibold"
              >
                Payday plan
              </button>
            </div>
            </div>

          <div className="mt-5 flex h-[calc(100vh-16rem)] min-h-[32rem] flex-col rounded-[1.8rem] border border-white/10 bg-white/10 p-4">
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {activeThread?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-[1.35rem] px-4 py-3 text-sm leading-6 shadow-sm ${
                      message.role === "user"
                        ? "bg-white text-slate-900"
                        : "bg-slate-950/55 text-white backdrop-blur"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`mt-2 text-xs ${
                        message.role === "user" ? "text-slate-500" : "text-white/55"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="max-w-[82%] rounded-[1.35rem] bg-slate-950/55 px-4 py-3 text-sm text-white backdrop-blur">
                    Thinking about your habit pattern...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/10 p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about your habits, spending, saving, or the next move..."
                  rows={3}
                  className="min-h-[4.5rem] flex-1 resize-none rounded-[1.2rem]"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="theme-button-primary inline-flex items-center justify-center gap-2 rounded-[1.2rem] px-5 py-3 text-sm font-semibold sm:min-w-36"
                >
                  <Send size={15} />
                  Send
                </button>
              </div>
              <p className="theme-text-soft mt-3 text-xs">
                Press Enter to send, Shift + Enter for a new line.
              </p>
            </div>
          </div>
        </main>

        <aside className="glass-card rounded-[2rem] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Brain size={18} />
            <div>
              <p className="theme-text font-semibold">Habit insights</p>
              <p className="theme-text-soft text-sm">What the planner is learning from your chat.</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {habitInsights.map((insight) => (
              <article
                key={insight.title}
                className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{insight.title}</p>
                    <p className="theme-text-soft mt-1 text-sm leading-6">
                      {insight.description}
                  </p>
                </div>
                  <div className={`rounded-full bg-gradient-to-r ${insight.accent} px-3 py-1 text-xs font-semibold text-white`}>
                    {insight.score}%
                  </div>
                </div>

                <div className="mt-4 h-2 rounded-full bg-white/10">
                <div
                    className={`h-2 rounded-full bg-gradient-to-r ${insight.accent}`}
                    style={{ width: `${insight.score}%` }}
                />
              </div>
            </article>
            ))}
          </div>

          <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/10 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} />
              <p className="font-semibold">Suggested focus</p>
            </div>
            <p className="theme-text-soft mt-2 text-sm leading-6">
              Your best next step is to watch the repeat window, not just the category total.
              If you can shrink one recurring habit, the rest of the budget gets easier.
            </p>
          </div>

          <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/10 p-4">
            <div className="flex items-center gap-2">
              <Target size={16} />
              <p className="font-semibold">Weekly goal</p>
            </div>
            <ul className="theme-text-soft mt-3 space-y-2 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>Reduce one impulse purchase window.</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Move one recurring spend into a planned bucket.</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Review the last 7 days before payday.</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}

