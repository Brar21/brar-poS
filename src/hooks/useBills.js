import { useState, useEffect } from "react";

export default function useBills() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bills") || "[]");
    setBills(stored);
  }, []);

  const saveBill = (bill) => {
    const updated = [bill, ...bills];
    setBills(updated);
    localStorage.setItem("bills", JSON.stringify(updated));
  };

  // ✅ SINGLE PAYMENT FUNCTION (USED EVERYWHERE)
  const payUdhaar = (billId, amount) => {
    const updated = bills.map((b) => {
      if (b.id === billId && b.dueAmount > 0) {
        const pay = Math.min(amount, b.dueAmount);
  
        return {
          ...b,
          dueAmount: b.dueAmount - pay,
          paidAmount: (b.paidAmount || 0) + pay,
          isCredit: b.dueAmount - pay > 0,
          paymentMethod: b.dueAmount - pay === 0 ? "CASH" : "UDHAAR",
          payments: [
            ...(b.payments || []),
            {
              amount: pay,
              date: new Date().toISOString(),
            },
          ],
        };
      }
      return b;
    });
  
    setBills(updated);
    localStorage.setItem("bills", JSON.stringify(updated));
  };

  return { bills, saveBill, payUdhaar };
}