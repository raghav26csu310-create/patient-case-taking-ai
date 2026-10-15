import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { AccessibilityBar } from "@/components/accessibility/accessibility-bar";
import { CaseGraphProvider } from "@/domain/case-graph/case-graph-store";
import { ScenarioSwitcher } from "@/components/scenarios/scenario-switcher";

export const metadata: Metadata = {
  title: "SIH26047 — Patient Case-Taking Software",
  description:
    "First-mile clinical case-taking intelligence for high-volume Indian Outpatient Departments (OPDs).",
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
