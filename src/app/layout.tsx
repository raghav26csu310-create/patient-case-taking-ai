import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { AccessibilityBar } from "@/components/accessibility/accessibility-bar";
import { CaseGraphProvider } from "@/domain/case-graph/case-graph-store";
import { ScenarioSwitcher } from "@/components/scenarios/scenario-switcher";

export const metadata: Metadata = {
  title: "SAATHI — Your Personal AI Health Companion",
  description:
    "A patient-first AI health companion that helps people tell their story, organize medical documents, and prepare for a doctor consultation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <CaseGraphProvider>
          <AccessibilityBar />
          <Navbar />
          <main className="flex-1 w-full" id="main-content" tabIndex={-1}>
            {children}
          </main>
          <ScenarioSwitcher />
        </CaseGraphProvider>
      </body>
    </html>
  );
}
