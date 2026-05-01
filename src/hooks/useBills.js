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
      if (b.id !== billId) return b;

      const payment = {
        amount: Number(amount),
        date: new Date().toISOString(),
      };

      const newPaid = (b.paidAmount || 0) + payment.amount;
      const newDue = (b.dueAmount || 0) - payment.amount;

      return {
        ...b,
        paidAmount: newPaid,
        dueAmount: newDue < 0 ? 0 : newDue,
        isCredit: newDue > 0, // ✅ auto switch
        paymentMethod: newDue <= 0 ? "PAID" : "UDHAAR",
        payments: [...(b.payments || []), payment],
      };
    });

    setBills(updated);
    localStorage.setItem("bills", JSON.stringify(updated));
  };

  return { bills, saveBill, payUdhaar };
}