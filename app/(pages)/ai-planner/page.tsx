import HeroContentAiPlanner from "@/app/Components/AIplanner/HeroContentPlanner/HeroContentPlanner";
import HistoryAside from "@/app/Components/AIplanner/HistoryAside/HistoryAside";
import MainChat from "@/app/Components/AIplanner/MainChat/MainChat";
import SuggestionSidebar from "@/app/Components/AIplanner/SuggestionSidebar/SuggestionSidebar";

export default function AIplanner() {
  return (
    <div className="page-shell flex min-h-[calc(100vh-5rem)] flex-col py-4 sm:py-6">
      {/* Page header */}
      <HeroContentAiPlanner />

      {/* 20 : 60 : 20 layout */}
      <section className="grid min-h-0 flex-1 gap-4  chatwrapper lg:gap-5">
        {/* ───────────────────────── LEFT — Chat history (20%) ───────────────────────── */}
        <HistoryAside />

        {/* ───────────────────────── CENTER — Chat with AI (60%) ───────────────────────── */}
        <MainChat />

        {/* ───────────────────────── RIGHT — AI plan (20%) ───────────────────────── */}
        <SuggestionSidebar />
      </section>
    </div>
  );
}
