"use client";

import { useState } from "react";

export default function CustomerDetail({ bills, phone, goBack, markPartialPaid }) {

  const customerBills = (bills || []).filter(
    (b) => String(b.customerPhone).trim() === String(phone).trim()
  );
const totalDue = (bills || [])
.filter((b) => String(b.customerPhone).trim() === String(phone).trim())
.reduce((sum, b) => sum + Number(b.dueAmount || 0), 0);
  console.log("PHONE:", phone, "BILLS:", bills);
const [pay,setPay]=useState("")
  return (
    <div className="p-4 bg-white min-h-screen text-black">

      <button onClick={goBack} className="mb-3 bg-gray-200 px-3 py-1 rounded">
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-3">Customer: {phone}</h2>

      <p className="text-red-600 font-bold mb-3">
        Total Due: ₹{totalDue}
      </p>

      {/* PARTIAL PAYMENT */}
      <input
      placeholder="Any Amount"
      type="number"
      value={pay}
      onChange={(e)=>setPay(e.target.value)}
      className=" border-black border text-black p-2 rounded-lg m-4"

      />

      <button
        onClick={() => markPartialPaid(phone, pay)}
        className="bg-green-600 text-white px-3 py-2 rounded mb-4"
      >
        Pay {pay}
      </button>

      {customerBills.map((b) => (
        <div key={b.id} className="border p-3 mb-2 rounded">
          <p>{b.date}</p>
          <p>₹{b.finalTotal}</p>
          <p className="text-red-500">Due: ₹{b.dueAmount}</p>
        </div>
      ))}
      <button
      onClick={() => {
        const msg = `Dear customer, your pending udhaar is ₹${totalDue}. Please clear it.`;
        const url = `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url);
      }}
      className="bg-green-500 text-white px-3 py-2 rounded mb-3"
    >
      Send Reminder 📲
    </button>

    </div>
  );
}