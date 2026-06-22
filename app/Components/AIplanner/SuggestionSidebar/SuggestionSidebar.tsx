import AIsuggestion from "@/app/lib/ai-suggestion";
import SuggestionSidebarClient from "./SuggestionSidebarClient";

export default async function SuggestionSidebar() {
  const result = await AIsuggestion();

  return (
    <aside className="glass-card flex min-h-[20rem] flex-col overflow-y-auto overflow-hidden rounded-[1.75rem] p-4 lg:min-h-0">
      <SuggestionSidebarClient initialResult={result} />
    </aside>
  );
}
