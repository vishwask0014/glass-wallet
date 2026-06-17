import { Sparkles } from "lucide-react";

export default function HeroContentAiPlanner() {
    return(
        <>
         <header className="mb-4 shrink-0 px-1 sm:mb-5">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] theme-chip">
          <Sparkles size={13} />
          AI planner
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
          Plan your money habits
        </h1>
        <p className="theme-text-soft mt-1 max-w-2xl text-sm">
          Chat history on the left, conversation in the center, and your AI plan
          on the right.
        </p>
      </header>
        </>
    )
}