"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [];

export default function MainChat() {
  const [chat, setChat] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError(null);

    const userMsg: ChatMessage = {
      id: `m${chat.length + 1}-${Date.now()}`,
      role: "user",
      content: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedChat = [...chat, userMsg];
    setChat(updatedChat);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-planner/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedChat.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message ?? `Server error: ${res.status}`);
      }

      if (!data.content) {
        throw new Error("No content in response");
      }

      const assistantMsg: ChatMessage = {
        id: `m${updatedChat.length + 1}-${Date.now()}`,
        role: "assistant",
        content: data.content,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChat((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Failed to fetch chat:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="glass-card-strong flex min-h-[28rem] flex-col overflow-hidden rounded-[1.75rem] lg:min-h-0">
      {/* Header */}
      <div className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] theme-chip">
          <MessageCircle size={13} />
          Chat with AI
        </div>
        <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] sm:text-xl">
          Weekend spending review
        </h2>
        <p className="theme-text-soft text-xs sm:text-sm">
          Ask about habits, budgets, patterns, or goals.
        </p>
      </div>

      {/* Messages + input */}
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-5">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {chat.length === 0 && !isLoading && (
            <p className="theme-text-soft text-center text-sm py-8">
              Start the conversation — ask about your spending habits.
            </p>
          )}

          {chat.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-[1.2rem] px-3.5 py-2.5 sm:max-w-[78%] sm:px-4 sm:py-3 ${
                    isUser
                      ? "bg-white text-slate-900 shadow-sm"
                      : "border border-white/10 bg-slate-950/50 text-white backdrop-blur"
                  }`}
                >
                  <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`mt-1.5 text-[0.68rem] ${
                      isUser ? "text-slate-500" : "text-white/50"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/50 px-4 py-3 text-white/50 backdrop-blur">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex justify-start">
              <div className="rounded-[1.2rem] border border-red-500/30 bg-red-950/30 px-4 py-3 text-red-300">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="mt-4 shrink-0 rounded-[1.2rem] border border-white/10 bg-white/8 p-3">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask about your spending habits..."
              rows={2}
              className="min-h-[3.5rem] flex-1 resize-none rounded-[1rem] text-sm"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="theme-button-primary inline-flex items-center justify-center gap-2 rounded-[1rem] px-4 py-2.5 text-sm font-semibold disabled:opacity-60 sm:min-w-28"
            >
              <Send size={14} />
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
          <p className="theme-text-soft mt-2 text-[0.68rem]">
            Press Enter to send, Shift+Enter for new line.
          </p>
        </div>
      </div>
    </main>
  );
}
