"use client";

import { useState } from "react";

export default function BillHistory({ bills, openInvoice, payUdhaar }) {
  const [type, setType] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [status, setStatus] = useState(""); // NEW
  const [search, setSearch] = useState(""); // NEW
  // ✅ FILTER LOGIC
  const filtered = bills.filter((b) => {
    // ✅ SEARCH (phone + name)
    if (search) {
      const s = search.toLowerCase();
  
      const phoneMatch = b.customerPhone?.toLowerCase().includes(s);
      const nameMatch = b.customerName?.toLowerCase().includes(s);
  
      if (!phoneMatch && !nameMatch) return false;
    }
  
    if (selectedCustomer) {
      return b.customerPhone === selectedCustomer;
    }
  
    if (type && b.paymentMethod !== type) return false;
  
    if (status === "PAID" && (b.dueAmount || 0) > 0) return false;
    if (status === "UDHAAR" && (b.dueAmount || 0) === 0) return false;
  
    if (min && b.finalTotal < Number(min)) return false;
    if (max && b.finalTotal > Number(max)) return false;
  
    return true;
  });
  // ✅ TOTAL SPENT BY CUSTOMER
  const customerTotal = filtered.reduce(
    (sum, b) => sum + b.finalTotal,
    0
  );
  const markAsPaid = (id, method = "CASH") => {
    const updated = bills.map((b) =>
      b.id === id
        ? {
          ...b,
          dueAmount: 0,
          paidAmount: b.finalTotal,
          isCredit: false,
          paymentMethod: method, // ✅ UPDATED
        }
        : b
    );

    localStorage.setItem("bills", JSON.stringify(updated));
    window.location.reload();
  };
  return (
    <div className="p-4 bg-gray-100 min-h-screen text-black">

      <h2 className="text-xl font-bold mb-4">Bill History</h2>

      {/* 🔙 CUSTOMER VIEW */}
      {selectedCustomer && (
        <div className="bg-blue-100 p-3 mb-3 rounded flex justify-between items-center">
          <div>
            <p className="text-sm">Customer</p>
            <p className="font-bold">📞 {selectedCustomer}</p>
            <p className="text-green-600">
              Total Spent: ₹{customerTotal}
            </p>
          </div>

          <button
            onClick={() => setSelectedCustomer(null)}
            className="bg-black text-white px-3 py-1 rounded"
          >
            Back
          </button>
        </div>
      )}

      {/* 🔥 FILTER BOX */}
      {!selectedCustomer && (
        <div className="bg-white p-3 rounded-xl shadow mb-4 space-y-3">
<input
  type="text"
  placeholder="Search phone or name..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border p-2 rounded w-full"
/>
<div className="flex gap-2">

{/* PAYMENT FILTER */}
<select
  value={type}
  onChange={(e) => setType(e.target.value)}
  className="border p-2 rounded w-1/3"
>
  <option value="">All Payments</option>
  <option value="CASH">Cash</option>
  <option value="UPI">UPI</option>
</select>

{/* ✅ NEW: UDHAAR FILTER */}
<select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="border p-2 rounded w-1/3"
>
  <option value="">All Status</option>
  <option value="PAID">Paid</option>
  <option value="UDHAAR">Udhaar</option>
</select>

{/* RESET */}
<button
  onClick={() => {
    setType("");
    setMin("");
    setMax("");
    setStatus(""); // NEW
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
      )}

      {/* 🔢 COUNT */}
      <p className="text-sm mb-2 text-gray-600">
        Showing {filtered.length} of {bills.length} bills
      </p>

      {/* 📋 BILL LIST */}
      {filtered.length === 0 ? (
        <p>No matching bills</p>
      ) : (
        filtered.map((bill) => (
          <div
            key={bill.id}
              className="bg-white border rounded-xl p-4 mb-3 shadow "
          >
            <p className="text-sm text-gray-500">{bill.date}</p>

            <p className="font-bold text-lg" 
            >
              ₹{bill.finalTotal}<span className=" hover:text-blue-500 hover:scale-105"
            onClick={() => openInvoice(bill)}
            > → Full Bill</span>
            </p>

            <p className="text-sm">
              Payment: {bill.paymentMethod}
            </p>

            <p className="text-xs text-gray-400">
              Items: {bill.items?.length || 0}
            </p>
            {bill.isCredit && bill.dueAmount > 0 && (
              <div className="mt-2 space-y-2">

                <input
                  type="number"
                  placeholder="Enter amount"
                  onChange={(e) => (bill._paying = e.target.value)}
                  className="border p-1 w-full"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    payUdhaar(bill.id, bill._paying || 0);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Pay
                </button>

              </div>
            )}
            {/* 📞 CUSTOMER */}
            {bill.customerPhone && (
              <div className="mt-2">
                <p className="text-sm text-blue-600">
                  📞 {bill.customerPhone}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent invoice open
                    setSelectedCustomer(bill.customerPhone);
                  }}
                  className="text-xs bg-blue-200 px-2 py-1 rounded mt-1"
                >
                  View History
                </button>
              </div>
            )}
            {bill.payments?.length > 0 && (
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                <p className="font-bold">Payment History</p>

                {bill.payments.map((p, i) => (
                  <p key={i}>
                    ₹{p.amount} paid on{" "}
                    {new Date(p.date).toLocaleDateString()}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))
      )}

    </div>
  );
}