"use client";

import { useState } from "react";

export default function BillHistory({ bills, openInvoice }) {
  const [type, setType] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  // ✅ FIXED FILTER LOGIC
  const filtered = bills.filter((b) => {
    if (type && b.paymentMethod !== type) return false;
    if (min && b.finalTotal < Number(min)) return false;
    if (max && b.finalTotal > Number(max)) return false;
    return true;
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-black">

      <h2 className="text-xl font-bold mb-4">Bill History</h2>

      {/* 🔥 FILTER BOX */}
      <div className="bg-white p-3 rounded-xl shadow mb-4 space-y-3">

        <div className="flex gap-2">

          {/* PAYMENT FILTER */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded w-1/2"
          >
            <option value="">All Payments</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
          </select>

          {/* RESET BUTTON */}
          <button
            onClick={() => {
              setType("");
              setMin("");
              setMax("");
            }}
            className="bg-red-500 text-white px-3 rounded"
          >
            Reset
          </button>

        </div>

        {/* AMOUNT FILTER */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="border p-2 rounded w-1/2"
          />

          <input
            type="number"
            placeholder="Max ₹"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="border p-2 rounded w-1/2"
          />
        </div>

      </div>

      {/* 🔥 RESULT COUNT */}
      <p className="text-sm mb-2 text-gray-600">
        Showing {filtered.length} of {bills.length} bills
      </p>

      {/* 🔥 BILL LIST */}
      {filtered.length === 0 ? (
        <p>No matching bills</p>
      ) : (
        filtered.map((bill) => (
          <div
            key={bill.id}
            onClick={() => openInvoice(bill)}
            className="bg-white border rounded-xl p-4 mb-3 shadow active:scale-95"
          >
            <p className="text-sm text-gray-500">{bill.date}</p>

            <p className="font-bold text-lg">
              ₹{bill.finalTotal}
            </p>

            <p className="text-sm">
              Payment: {bill.paymentMethod}
            </p>

            <p className="text-xs text-gray-400">
              Items: {bill.items?.length || 0}
            </p>
          </div>
        ))
      )}

    </div>
  );
}