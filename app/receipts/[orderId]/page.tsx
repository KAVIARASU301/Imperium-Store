"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Receipt = {
  receiptNumber: string;
  issuedAt: string;
  seller: { name: string; email: string; address: string };
  customer: { email?: string };
  item: { name: string; description: string; formattedAmount?: string };
  items?: { name: string; description: string; formattedAmount: string }[];
  payment: { orderId: string; paymentId: string | null; paidAt: string; method: string };
  totals: {
    formattedSubtotal: string;
    formattedTax: string;
    formattedTotal: string;
  };
  note: string;
};

export default function ReceiptPage() {
  const params = useParams<{ orderId: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadReceipt() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          setError("Log in to view this receipt.");
          return;
        }

        const res = await fetch(`/api/receipts/${encodeURIComponent(params.orderId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await res.json();
        if (!active) return;
        if (!res.ok) throw new Error(payload.message ?? "Unable to load receipt");
        setReceipt(payload.receipt as Receipt);
      } catch (error) {
        if (active) setError(error instanceof Error ? error.message : "Unable to load receipt");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReceipt();
    return () => {
      active = false;
    };
  }, [params.orderId]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 print:max-w-none print:px-0 print:py-0">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-white">
          Back to purchases
        </Link>
        {receipt ? (
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white "
          >
            Print / Save PDF
          </button>
        ) : null}
      </div>

      <section className="border border-cyan-border bg-section p-8 text-white shadow-xl shadow-black/20 print:border-slate-300 print:bg-white print:text-slate-950 print:shadow-none">
        {loading ? <p className="font-mono text-sm uppercase tracking-[0.12em] text-muted">Loading receipt...</p> : null}
        {error ? <p className="text-sm text-amber-200 print:text-slate-950">{error}</p> : null}
        {receipt ? (
          <div>
            <div className="flex flex-wrap justify-between gap-6 border-b border-cyan-border pb-6 print:border-slate-300">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand print:text-slate-600">Payment Receipt</p>
                <h1 className="mt-3 text-3xl font-bold tracking-normal">{receipt.receiptNumber}</h1>
                <p className="mt-2 text-sm text-muted print:text-slate-600">Issued {receipt.issuedAt}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold">{receipt.seller.name}</p>
                <p className="mt-1 text-sm text-muted print:text-slate-600">{receipt.seller.email}</p>
                <p className="mt-1 text-sm text-muted print:text-slate-600">{receipt.seller.address}</p>
              </div>
            </div>

            <div className="grid gap-6 border-b border-cyan-border py-6 print:border-slate-300 sm:grid-cols-2">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted print:text-slate-600">Billed to</p>
                <p className="mt-2 font-semibold">{receipt.customer.email ?? "Customer"}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted print:text-slate-600">Payment</p>
                <p className="mt-2 text-sm">Paid via {receipt.payment.method} on {receipt.payment.paidAt}</p>
                <p className="mt-2 font-mono text-xs text-muted print:text-slate-600">Order: {receipt.payment.orderId}</p>
                {receipt.payment.paymentId ? <p className="mt-1 font-mono text-xs text-muted print:text-slate-600">Payment: {receipt.payment.paymentId}</p> : null}
              </div>
            </div>

            <div className="py-6">
              <div className="grid gap-px border border-cyan-border bg-cyan-border print:border-slate-300 print:bg-slate-300">
                {(receipt.items?.length ? receipt.items : [{ ...receipt.item, formattedAmount: receipt.item.formattedAmount ?? receipt.totals.formattedSubtotal }]).map((item) => (
                  <div key={item.name} className="grid gap-3 bg-main p-4 print:bg-white sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-2 text-sm leading-6 text-muted print:text-slate-600">{item.description}</p>
                    </div>
                    <p className="font-semibold tabular-nums">{item.formattedAmount}</p>
                  </div>
                ))}
              </div>

              <div className="ml-auto mt-6 max-w-sm space-y-3">
                <div className="flex justify-between gap-4 text-sm text-muted print:text-slate-600">
                  <span>Subtotal</span>
                  <span>{receipt.totals.formattedSubtotal}</span>
                </div>
                <div className="flex justify-between gap-4 text-sm text-muted print:text-slate-600">
                  <span>GST</span>
                  <span>{receipt.totals.formattedTax}</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-cyan-border pt-3 text-xl font-bold print:border-slate-300">
                  <span>Total paid</span>
                  <span>{receipt.totals.formattedTotal}</span>
                </div>
              </div>
            </div>

            <p className="border-t border-cyan-border pt-5 text-sm leading-6 text-muted print:border-slate-300 print:text-slate-600">{receipt.note}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
