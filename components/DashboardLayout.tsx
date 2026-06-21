import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="px-6 py-12 max-w-5xl mx-auto">{children}</div>;
}
