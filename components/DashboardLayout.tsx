import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1200px] px-6 py-12">{children}</div>;
}
