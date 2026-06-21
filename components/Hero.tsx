import Link from "next/link";
import TerminalPreview from "@/components/TerminalPreview";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[1.05fr_.95fr] md:py-28">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.28em] text-cyan-300">Trading tools / courses / templates</p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
          Trade Better. Practice Smarter. Build Discipline.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
          Imperium Store gives traders access to focused trading apps, practice tools, and structured options trading education.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/products" className="bg-cyan-300 px-6 py-3 text-center font-semibold text-black hover:bg-cyan-200">View Products</Link>
          <Link href="/products/cvd-practice-chart" className="border border-slate-700 px-6 py-3 text-center font-semibold text-white hover:border-cyan-300">Watch Demo</Link>
        </div>
      </div>
      <TerminalPreview />
    </section>
  );
}
