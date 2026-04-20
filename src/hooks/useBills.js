import { useState, useEffect } from "react";

export default function useBills() {
  const [bills, setBills] = useState([]);

  // ✅ Load on start
  useEffect(() => {
    const data = localStorage.getItem("bills");
    if (data) setBills(JSON.parse(data));
  }, []);

  // ✅ Save + sync
  const saveBill = (bill) => {
    const existing = JSON.parse(localStorage.getItem("bills") || "[]");

    const updated = [bill, ...existing];

    localStorage.setItem("bills", JSON.stringify(updated));

    // 💥 Force React update
    setBills(updated);
  };

  return { bills, saveBill };
}