import type { ReactNode } from "react";
import { TopNav } from "./TopNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <TopNav />

      <main className="container">
        {children}
      </main>
    </>
  );
}