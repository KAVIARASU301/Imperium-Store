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
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-cyan-border bg-section text-white transition hover:border-brand hover:bg-card md:hidden"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <Image
          src={isOpen ? "/icons/cross.svg" : "/icons/menu.svg"}
          alt=""
          width={22}
          height={22}
          className="h-[22px] w-[22px]"
          suppressHydrationWarning
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-72 overflow-visible rounded-md border border-cyan-border bg-section/95 p-2 text-sm text-white shadow-2xl shadow-black/40 backdrop-blur-xl md:hidden" role="menu">
          <Link href="/products" className={getMobileNavLinkClass(isProductsActive, "flex items-center")} role="menuitem" onClick={() => setIsOpen(false)}>
            Products
          </Link>
          <Link href="/cart" className={getMobileNavLinkClass(isCartActive, "flex items-center gap-3")} role="menuitem" onClick={() => setIsOpen(false)}>
            <Image src="/icons/cart.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" suppressHydrationWarning />
            <span>Cart</span>
            <CartCount />
          </Link>
          <Link href="/dashboard" className={getMobileNavLinkClass(isDashboardActive, "flex items-center")} role="menuitem" onClick={() => setIsOpen(false)}>
            My Purchases
          </Link>
          <div className="mt-2 border-t border-cyan-border pt-3">
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
    "min-h-12 rounded-md border border-transparent px-4 py-3 font-semibold transition hover:border-cyan-border hover:bg-card hover:text-white",
    isActive ? "border-brand bg-card/70 text-white" : "text-muted",
  ].join(" ");
}
