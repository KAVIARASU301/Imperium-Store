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
      <div className="hidden items-center gap-1 text-sm font-medium text-[#c5d5ee] md:flex">
        <Link href="/products" className="border border-transparent px-3 py-2 hover:border-[#1b3055] hover:bg-[#111d35] hover:text-white">Products</Link>
        <Link href="/dashboard" className="border border-transparent px-3 py-2 hover:border-[#1b3055] hover:bg-[#111d35] hover:text-white">My Purchases</Link>
        <HeaderAccount />
      </div>

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center border border-[#1b3055] bg-[#0c1525] text-[#c5d5ee] hover:border-[#1e52e8] hover:bg-[#111d35] md:hidden"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="text-xl leading-none" aria-hidden="true">{isOpen ? "×" : "☰"}</span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-64 overflow-visible border border-[#1b3055] bg-[#0c1525]/95 p-3 text-sm text-[#c5d5ee] shadow-2xl shadow-black/40 backdrop-blur-xl md:hidden" role="menu">
          <Link href="/products" className="block border border-transparent px-4 py-3 transition hover:border-[#1b3055] hover:bg-[#111d35] hover:text-white" role="menuitem" onClick={() => setIsOpen(false)}>
            Products
          </Link>
          <Link href="/dashboard" className="block border border-transparent px-4 py-3 transition hover:border-[#1b3055] hover:bg-[#111d35] hover:text-white" role="menuitem" onClick={() => setIsOpen(false)}>
            My Purchases
          </Link>
          <div className="mt-2 border-t border-[#1b3055] px-4 pt-3">
            <HeaderAccount />
          </div>
        </div>
      ) : null}
    </div>
  );
}
