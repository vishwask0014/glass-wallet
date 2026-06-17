"use client";

import { usePathname } from "next/navigation";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAiPlanner = pathname.startsWith("/ai-planner");

  return (
    <main className={isAiPlanner ? "flex-1" : "flex-1 pb-10"}>{children}</main>
  );
}
