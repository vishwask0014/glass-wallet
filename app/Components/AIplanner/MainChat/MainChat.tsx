import { MessageCircle, Send } from "lucide-react";
import Groq from "groq-sdk";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
};

const ACTIVE_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "I'm ready to help you spot spending patterns, compare weeks, and turn habits into simple plans.",
    time: "9:12 AM",
  },
  {
    id: "m2",
    role: "user",
    content:
      "Why does my spending always spike on Friday night and Saturday afternoon?",
    time: "9:14 AM",
  },
  {
    id: "m3",
    role: "assistant",
    content:
      "That usually means a routine, not random spending. We can look for trigger times, frequent categories, and the places where small purchases add up.",
    time: "9:14 AM",
  },
];

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// CHAT CONTEXT WINDOW TIMEOUT
const chatSession = 3600; // 1hr

export default async function MainChat() {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "joke on bike",
      },
    ],
    model: "openai/gpt-oss-20b",
  });

  //   console.log("chatCompletion.....", chatCompletion);

  try {
  } catch (error) {
    console.error(`NOT ABLE TO FETCH "AI" API:`, error);
  }

  return (
    <>
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
            {ACTIVE_MESSAGES.map((message) => {
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
                    <p className="text-sm leading-6">{message.content}</p>
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
          </div>

          {/* Input — disabled until AI is connected */}
          <div className="mt-4 shrink-0 rounded-[1.2rem] border border-white/10 bg-white/8 p-3">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
              <textarea
                disabled
                placeholder="AI chat will be available soon..."
                rows={2}
                className="min-h-[3.5rem] flex-1 resize-none rounded-[1rem] text-sm opacity-70"
              />
              <button
                type="button"
                disabled
                className="theme-button-primary inline-flex items-center justify-center gap-2 rounded-[1rem] px-4 py-2.5 text-sm font-semibold opacity-60 sm:min-w-28"
              >
                <Send size={14} />
                Send
              </button>
            </div>
            <p className="theme-text-soft mt-2 text-[0.68rem]">
              Static preview — connect AI to enable messaging.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
