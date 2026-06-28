"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartCount from "@/components/CartCount";
import HeaderAccount from "@/components/HeaderAccount";

export default function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isProductsActive = pathname === "/products" || pathname.startsWith("/products/");
  const isCartActive = pathname === "/cart";
  const isDashboardActive = pathname === "/dashboard";

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
      <div className="hidden items-center gap-1 text-sm font-medium text-white md:flex">
        <Link href="/products" className={getNavLinkClass(isProductsActive)}>Products</Link>
        <Link href="/cart" className={getNavLinkClass(isCartActive, "inline-flex items-center gap-2")}>
          <Image src="/icons/cart.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" suppressHydrationWarning />
          <span>Cart</span>
          <CartCount />
        </Link>
        <Link href="/dashboard" className={getNavLinkClass(isDashboardActive)}>My Purchases</Link>
        <HeaderAccount />
      </div>

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center border border-cyan-border bg-section text-white hover:border-brand hover:bg-card md:hidden"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="text-xl leading-none" aria-hidden="true">{isOpen ? "×" : "☰"}</span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-64 overflow-visible border border-cyan-border bg-section/95 p-3 text-sm text-white shadow-2xl shadow-black/40 backdrop-blur-xl md:hidden" role="menu">
          <Link href="/products" className={getMobileNavLinkClass(isProductsActive, "block")} role="menuitem" onClick={() => setIsOpen(false)}>
            Products
          </Link>
          <Link href="/cart" className={getMobileNavLinkClass(isCartActive, "flex items-center gap-2")} role="menuitem" onClick={() => setIsOpen(false)}>
            <Image src="/icons/cart.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" suppressHydrationWarning />
            <span>Cart</span>
            <CartCount />
          </Link>
          <Link href="/dashboard" className={getMobileNavLinkClass(isDashboardActive, "block")} role="menuitem" onClick={() => setIsOpen(false)}>
            My Purchases
          </Link>
          <div className="mt-2 border-t border-cyan-border px-4 pt-3">
            <HeaderAccount />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getNavLinkClass(isActive: boolean, layoutClass = "") {
  return [
    "border border-transparent border-b-2 px-3 py-2 transition hover:border-cyan-border hover:bg-card hover:text-white",
    isActive ? "border-b-brand bg-card/60 text-white" : "border-b-transparent",
    layoutClass,
  ].join(" ");
}

function getMobileNavLinkClass(isActive: boolean, layoutClass: string) {
  return [
    layoutClass,
    "border border-transparent border-b-2 px-4 py-3 transition hover:border-cyan-border hover:bg-card hover:text-white",
    isActive ? "border-b-brand bg-card/60 text-white" : "border-b-transparent",
  ].join(" ");
}
