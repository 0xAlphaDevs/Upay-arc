"use client";

import { useState } from "react";
import { StatusBadge, type PaymentStatus } from "./StatusBadge";
import { EmptyState } from "./AsyncStates";
import { TokenIcon } from "@/app/components/TokenIcon";

export interface PaymentRow {
  id: string;
  date: string;
  amount: string;
  payer: string;
  via: string;
  viaChain: string;
  status: PaymentStatus;
  hash: string | null;
  explorerUrl: string | null;
}

export interface PaymentStats {
  settled30d: string;
  paymentsCount: number;
  sourceChains: number;
}

function ReceiptDetail({ payment, onBack }: { payment: PaymentRow; onBack: () => void }) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-[18px] rounded-md p-0 text-[13.5px] font-medium text-[#6B6577] transition-colors hover:text-upay-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-upay-blue focus-visible:ring-offset-2"
      >
        ← All payments
      </button>

      <div className="max-w-[560px] overflow-hidden rounded-2xl border border-[#ECE8F1] bg-white">
        <div className="border-b border-[#F0EDF4] px-[26px] py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-[12.5px] text-[#8B8595]">{payment.id}</div>
              <div className="mt-[7px] flex items-center gap-[9px]">
                <TokenIcon token="USDC" size={26} />
                <span className="font-mono text-[30px] font-bold tracking-[-.02em] text-upay-ink">
                  {payment.amount}
                </span>
                <span className="text-[16px] font-semibold text-[#1B1622]">USDC</span>
              </div>
              <div className="mt-[5px] text-[13px] font-medium text-[#1F7A4D]">
                {payment.status === "Paid" ? "Settled" : payment.status} · {payment.date}
              </div>
            </div>
            <StatusBadge status={payment.status} />
          </div>
        </div>

        <div className="flex flex-col px-[26px] py-[22px]">
          <div className="flex justify-between border-b border-[#F4F2F7] py-[11px]">
            <span className="text-[14px] text-[#6B6577]">Customer paid with</span>
            <span className="text-[14px] font-medium text-upay-ink">
              {payment.via} · {payment.viaChain}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#F4F2F7] py-[11px]">
            <span className="text-[14px] text-[#6B6577]">uPay fee</span>
            <span className="font-mono text-[14px] font-medium text-upay-ink">
              0.00 <span className="text-[#A39DAD]">(no fee on testnet yet)</span>
            </span>
          </div>
          <div className="flex justify-between border-b border-[#F4F2F7] py-[11px]">
            <span className="text-[14px] text-[#6B6577]">Net to you</span>
            <span className="font-mono text-[14px] font-semibold text-upay-ink">{payment.amount} USDC</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#F4F2F7] py-[11px]">
            <span className="text-[14px] text-[#6B6577]">Customer</span>
            <span className="font-mono text-[13.5px] font-medium text-upay-ink">{payment.payer}</span>
          </div>
          <div className="flex items-center justify-between py-[11px]">
            <span className="text-[14px] text-[#6B6577]">Transaction</span>
            {payment.hash ? (
              <a
                href={payment.explorerUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[13.5px] font-medium text-upay-blue hover:underline"
              >
                {payment.hash.slice(0, 10)}…{payment.hash.slice(-6)} ↗
              </a>
            ) : (
              <span className="font-mono text-[13.5px] font-medium text-[#A39DAD]">Pending</span>
            )}
          </div>
        </div>

        <div className="flex gap-[10px] border-t border-[#F0EDF4] bg-[#FBFAFC] px-[26px] py-[18px]">
          <button
            type="button"
            className="rounded-[9px] border border-[#E6E1EC] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#1B1622] transition-colors hover:bg-[#F9F7F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-upay-blue focus-visible:ring-offset-2"
          >
            Export receipt
          </button>
          {payment.explorerUrl && (
            <a
              href={payment.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[9px] bg-[#EAF0FF] px-4 py-2.5 text-[13.5px] font-semibold text-upay-bluedark transition-colors hover:bg-[#DCE7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-upay-blue focus-visible:ring-offset-2"
            >
              View on Arc Explorer ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function PaymentsView({ payments, stats }: { payments: PaymentRow[]; stats: PaymentStats }) {
  const [selected, setSelected] = useState<PaymentRow | null>(null);

  if (selected) {
    return <ReceiptDetail payment={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <div className="mb-[22px] flex items-end justify-between">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-.02em] text-upay-ink">Payments</h1>
          <p className="mt-1.5 text-[14px] text-[#6B6577]">
            Every payment settles to USDC on Arc, no matter what the customer paid with.
          </p>
        </div>
      </div>

      {payments.length > 0 && (
        <div className="mb-[22px] grid grid-cols-3 gap-3.5">
          <div className="rounded-[13px] border border-[#ECE8F1] bg-white p-4">
            <div className="text-[12px] font-medium text-[#8B8595]">Settled (30d)</div>
            <div className="mt-[5px] font-mono text-[22px] font-bold text-upay-ink">{stats.settled30d}</div>
          </div>
          <div className="rounded-[13px] border border-[#ECE8F1] bg-white p-4">
            <div className="text-[12px] font-medium text-[#8B8595]">Payments</div>
            <div className="mt-[5px] font-mono text-[22px] font-bold text-upay-ink">{stats.paymentsCount}</div>
          </div>
          <div className="rounded-[13px] border border-[#ECE8F1] bg-white p-4">
            <div className="text-[12px] font-medium text-[#8B8595]">Source chains</div>
            <div className="mt-[5px] font-mono text-[22px] font-bold text-upay-ink">{stats.sourceChains}</div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-[14px] border border-[#ECE8F1] bg-white">
        {payments.length === 0 ? (
          <EmptyState
            title="No payments yet"
            description="Payments will show up here as soon as a customer checks out with your uPay button."
          />
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[1.4fr_1.3fr_1.2fr_1.1fr_.8fr] gap-3 border-b border-[#F0EDF4] bg-[#FBFAFC] px-[18px] py-[13px] text-[11.5px] font-semibold uppercase tracking-[.03em] text-[#A39DAD]">
              <div>Payment</div>
              <div>Paid with</div>
              <div>Settled</div>
              <div>Customer</div>
              <div>Status</div>
            </div>
            {payments.map((payment) => (
              <button
                key={payment.id}
                type="button"
                onClick={() => setSelected(payment)}
                className="grid w-full grid-cols-[1.4fr_1.3fr_1.2fr_1.1fr_.8fr] items-center gap-3 border-b border-[#F4F2F7] px-[18px] py-[15px] text-left transition-colors last:border-b-0 hover:bg-[#FCFBFE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-upay-blue focus-visible:ring-inset"
              >
                <div>
                  <div className="font-mono text-[13.5px] font-semibold text-upay-ink">{payment.id}</div>
                  <div className="mt-0.5 text-[12px] text-[#A39DAD]">{payment.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <TokenIcon token={payment.via} className="rounded-full" />
                  <span className="text-[13px] font-medium text-[#4A4458]">
                    {payment.via} · {payment.viaChain}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TokenIcon token="USDC" className="rounded-full" />
                  <span className="font-mono text-[13.5px] font-semibold text-upay-ink">{payment.amount}</span>
                </div>
                <div className="font-mono text-[13px] text-[#6B6577]">{payment.payer}</div>
                <div>
                  <StatusBadge status={payment.status} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
