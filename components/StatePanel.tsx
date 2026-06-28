import Image from "next/image";
import type { ReactNode } from "react";

type StatePanelTone = "info" | "success" | "warning" | "error";

type StatePanelProps = {
  tone?: StatePanelTone;
  eyebrow: string;
  title: string;
  description: string;
  icon?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  compact?: boolean;
};

const toneStyles: Record<StatePanelTone, { border: string; text: string; glow: string; fallbackIcon: string }> = {
  info: {
    border: "border-cyan-border",
    text: "text-brand",
    glow: "shadow-[0_18px_48px_rgba(0,0,0,0.28)]",
    fallbackIcon: "/icons/info.svg",
  },
  success: {
    border: "border-success/35",
    text: "text-success",
    glow: "shadow-[0_18px_48px_rgba(13,95,60,0.18)]",
    fallbackIcon: "/icons/success/success-color-32.png",
  },
  warning: {
    border: "border-warning/35",
    text: "text-warning",
    glow: "shadow-[0_18px_48px_rgba(112,72,8,0.18)]",
    fallbackIcon: "/icons/warning/warning-40.png",
  },
  error: {
    border: "border-error/35",
    text: "text-error",
    glow: "shadow-[0_18px_48px_rgba(119,31,31,0.20)]",
    fallbackIcon: "/icons/error/error-color-32.png",
  },
};

export default function StatePanel({
  tone = "info",
  eyebrow,
  title,
  description,
  icon,
  actions,
  children,
  className = "",
  compact = false,
}: StatePanelProps) {
  const styles = toneStyles[tone];
  return (
    <section className={`rounded-md border ${styles.border} bg-section ${compact ? "p-4" : "p-6 sm:p-8"} ${styles.glow} ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border ${styles.border} bg-main/70 p-2`}>
          <Image src={icon ?? styles.fallbackIcon} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`font-mono text-[11px] font-semibold uppercase tracking-[0.16em] ${styles.text}`}>{eyebrow}</p>
          <h2 className={`${compact ? "mt-1 text-lg" : "mt-2 text-2xl"} font-bold tracking-normal text-white`}>{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
          {children ? <div className="mt-4">{children}</div> : null}
          {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
