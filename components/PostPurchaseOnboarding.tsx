import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type PostPurchaseOnboardingProps = {
  className?: string;
  orderId?: string | null;
  showTerminalPasswordStep?: boolean;
  context?: "success" | "dashboard";
};

type OnboardingStep = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
  icon: string;
  accent?: "gold" | "success";
};

type OnboardingLinkProps = {
  href: string;
  className: string;
  children: ReactNode;
};

function OnboardingLink({ href, className, children }: OnboardingLinkProps) {
  if (href.includes("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function PostPurchaseOnboarding({
  className = "",
  orderId,
  showTerminalPasswordStep = false,
  context = "dashboard",
}: PostPurchaseOnboardingProps) {
  const steps: OnboardingStep[] = [
    {
      eyebrow: "Download",
      title: "Get the correct build from My Purchases.",
      description:
        "Choose the Windows or Linux build from your licensed downloads. Access stays tied to the account used during checkout.",
      href: "/dashboard#downloads",
      action: "Go to downloads",
      icon: "/icons/download.svg",
      accent: "success",
    },
    ...(showTerminalPasswordStep
      ? [
          {
            eyebrow: "Terminal login",
            title: "Create a terminal password if you used Google.",
            description:
              "Google can sign in to the store, but the desktop terminal authenticates with your store email and password. Set this before opening Imperium.",
            href: "/dashboard#terminal-password",
            action: "Set password",
            icon: "/icons/settings_gear.svg",
            accent: "gold" as const,
          },
        ]
      : []),
    {
      eyebrow: "Receipt",
      title: "Keep the order reference available.",
      description:
        "Receipts help with support and account recovery. Save the Razorpay order reference if you ever need help matching a payment.",
      href: orderId ? `/receipts/${encodeURIComponent(orderId)}` : "/dashboard#downloads",
      action: orderId ? "View receipt" : "Find receipts",
      icon: "/icons/receipt.svg",
    },
    {
      eyebrow: "Support",
      title: "Contact support if download or login gets stuck.",
      description:
        "Share your registered account email, Razorpay order ID, product name, operating system, and any error message so support can verify quickly.",
      href: "/support",
      action: "Contact support",
      icon: "/icons/support/support.svg",
    },
  ];

  return (
    <section
      className={`rounded-md border border-cyan-border bg-[linear-gradient(180deg,rgba(16,29,47,0.94),rgba(11,22,38,0.98))] p-5 shadow-[0_20px_58px_rgba(0,0,0,0.30)] sm:p-6 ${className}`}
    >
      <div className="flex flex-col gap-3 border-b border-cyan-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-bright">
            {context === "success" ? "Post-purchase setup" : "Start here"}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-normal text-white">
            {context === "success" ? "Your purchase is ready. Follow these steps next." : "Finish setup from your purchase library."}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Download first, set terminal authentication when required, keep your receipt, and use support with the right details if anything blocks installation.
          </p>
        </div>
        <OnboardingLink
          href="/dashboard#downloads"
          className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white lg:shrink-0"
        >
          Go to downloads
        </OnboardingLink>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <article
            key={step.eyebrow}
            className="grid min-h-44 gap-4 rounded-md border border-cyan-border bg-main/58 p-4 sm:grid-cols-[3rem_minmax(0,1fr)]"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-md border p-2 ${
                step.accent === "success"
                  ? "border-success/35 bg-success/10"
                  : step.accent === "gold"
                    ? "border-gold/35 bg-gold/10"
                    : "border-cyan-border bg-section"
              }`}
            >
              <Image src={step.icon} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {step.eyebrow}
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold leading-6 text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
              <OnboardingLink
                href={step.href}
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md border border-cyan-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:border-brand hover:bg-card-hover"
              >
                {step.action}
              </OnboardingLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
