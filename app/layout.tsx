import type { Metadata } from "next";
import "./globals.css";
import Header from "./Components/Header/Header";

const themeScript = `
(() => {
  const storageKey = "glass-wallet-theme";
  const root = document.documentElement;
  const stored = localStorage.getItem(storageKey);
  const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const theme = stored === "dark" || stored === "light" ? stored : system;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();
`;

export const metadata: Metadata = {
  title: "Glass Wallet AI",
  description:
    "An AI-driven money management app that learns spending habits, plans weekly and monthly budgets, and suggests better saving and investing moves.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-theme="light"
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <div className="relative isolate min-h-screen overflow-x-hidden">
          <div
            aria-hidden="true"
            className="ambient-orb ambient-orb-primary pointer-events-none fixed inset-x-0 top-[-8rem] z-0 mx-auto h-[34rem] w-[34rem]"
          />
          <div
            aria-hidden="true"
            className="ambient-orb ambient-orb-primary pointer-events-none fixed right-[10%] top-24 z-0 h-[22rem] w-[22rem] opacity-60"
          />
          <div
            aria-hidden="true"
            className="ambient-orb ambient-orb-secondary pointer-events-none fixed left-[-12rem] top-40 z-0 h-[26rem] w-[26rem]"
          />
          <div
            aria-hidden="true"
            className="ambient-orb ambient-orb-tertiary pointer-events-none fixed bottom-[-10rem] right-[-8rem] z-0 h-[28rem] w-[28rem]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-0 z-0 h-48 bg-gradient-to-b from-white/10 to-transparent"
          />

          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-10">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
