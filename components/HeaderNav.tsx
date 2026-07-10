"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartCount from "@/components/CartCount";
import HeaderAccount from "@/components/HeaderAccount";

export default function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productType = searchParams.get("type");
  const isProductsActive = pathname === "/products" || pathname.startsWith("/products/");
  const isSoftwareActive = isProductsActive && productType !== "courses";
  const isCoursesActive = isProductsActive && productType === "courses";
  const isCartActive = pathname === "/cart";
  const isDashboardActive = pathname === "/dashboard";

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <div className="hidden items-center gap-1.5 text-sm font-medium text-white md:flex">
        <Link href="/products?type=software" className={getNavLinkClass(isSoftwareActive)}>Software</Link>
        <Link href="/products?type=courses" className={getNavLinkClass(isCoursesActive)}>Courses</Link>
        <Link href="/cart" className={getNavLinkClass(isCartActive, "inline-flex items-center gap-2")}>
          <Image src="/icons/cart.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" suppressHydrationWarning />
          <span>Cart</span>
          <CartCount />
        </Link>
        <Link href="/dashboard" className={getNavLinkClass(isDashboardActive)}>My Purchases</Link>
        <HeaderAccount />
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <HeaderAccount compact />
        <button
          type="button"
          className="inline-flex h-12 w-12 touch-manipulation select-none items-center justify-center rounded-md border border-cyan-border bg-section text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition active:border-brand active:bg-card hover:border-brand hover:bg-card"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls="mobile-navigation"
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
      </div>

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-14 z-40 cursor-default bg-black/40 sm:top-[69px] md:hidden"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
          />
          <div
            id="mobile-navigation"
            className="fixed left-3 right-3 top-14 z-50 max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain rounded-md border border-cyan-border bg-section/98 p-2 text-sm text-white shadow-2xl shadow-black/50 backdrop-blur-xl sm:top-[69px] sm:max-h-[calc(100dvh-5.25rem)] md:hidden"
            role="menu"
          >
          <Link href="/products?type=software" className={getMobileNavLinkClass(isSoftwareActive, "flex items-center")} role="menuitem" onClick={() => setIsOpen(false)}>
            Software
          </Link>
          <Link href="/products?type=courses" className={getMobileNavLinkClass(isCoursesActive, "flex items-center")} role="menuitem" onClick={() => setIsOpen(false)}>
            Courses
          </Link>
          <Link href="/cart" className={getMobileNavLinkClass(isCartActive, "flex items-center gap-3")} role="menuitem" onClick={() => setIsOpen(false)}>
            <Image src="/icons/cart.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" suppressHydrationWarning />
            <span>Cart</span>
            <CartCount />
          </Link>
          <Link href="/dashboard" className={getMobileNavLinkClass(isDashboardActive, "flex items-center")} role="menuitem" onClick={() => setIsOpen(false)}>
            My Purchases
          </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

function getNavLinkClass(isActive: boolean, layoutClass = "") {
  return [
    "rounded-md border px-3 py-2 transition hover:border-cyan-border hover:bg-card hover:text-white",
    isActive ? "border-brand/50 bg-card/80 text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]" : "border-transparent text-muted",
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
