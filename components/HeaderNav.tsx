"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import HeaderAccount from "@/components/HeaderAccount";

export default function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <div className="hidden items-center gap-1 text-sm font-medium text-slate-300 md:flex">
        <Link href="/products" className="rounded-full px-3 py-2 hover:bg-white/5 hover:text-white">Products</Link>
        <Link href="/dashboard" className="rounded-full px-3 py-2 hover:bg-white/5 hover:text-white">My Purchases</Link>
        <HeaderAccount />
      </div>

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10 md:hidden"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="text-xl leading-none" aria-hidden="true">{isOpen ? "×" : "☰"}</span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-64 overflow-visible rounded-2xl border border-white/10 bg-[#080B12]/95 p-3 text-sm text-slate-300 shadow-2xl shadow-black/40 backdrop-blur-xl md:hidden" role="menu">
          <Link href="/products" className="block rounded-xl px-4 py-3 transition hover:bg-white/5 hover:text-white" role="menuitem" onClick={() => setIsOpen(false)}>
            Products
          </Link>
          <Link href="/dashboard" className="block rounded-xl px-4 py-3 transition hover:bg-white/5 hover:text-white" role="menuitem" onClick={() => setIsOpen(false)}>
            My Purchases
          </Link>
          <div className="mt-2 border-t border-white/10 px-4 pt-3">
            <HeaderAccount />
          </div>
        </div>
      ) : null}
    </div>
  );
}
