"use client";

import { useState } from "react";

export default function BillHistory({ bills,openInvoice }) {

return (
    <div className="p-4 bg-gray-100 min-h-screen text-black">

      <h2 className="text-xl font-bold mb-4 text-black">
        Bill History
      </h2>

      {bills.length === 0 ? (
        <p className="text-black">No bills yet</p>
      ) : (
        bills.map((bill) => (
          <div onClick={() => {console.log("clicked bill",bill)
            openInvoice(bill)}}
            key={bill.id}
            className="bg-white text-black border rounded-lg p-4 mb-3 shadow"
          >
            <p className="text-sm text-gray-600">{bill.date}</p>

            <p className="font-bold text-lg">
              ₹{bill.finalTotal}
            </p>

            <p className="text-sm">
              Payment: {bill.paymentMethod}
            </p>

            <p className="text-xs text-gray-500">
              Items: {bill.items?.length || 0}
            </p>
          </div>
        ))
      )}

    </div>
  );
}