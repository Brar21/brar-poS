"use client";

import { useState, useEffect } from "react";

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);

  // ✅ LOAD
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("customers") || "[]");
    setCustomers(data);
  }, []);

  // ✅ SAVE
  const saveCustomers = (data) => {
    localStorage.setItem("customers", JSON.stringify(data));
    setCustomers(data);
  };

  // ✅ ADD CUSTOMER
  const addCustomer = (customer) => {
    if (!customer.phone) return;

    setCustomers((prev) => {
      // prevent duplicate
      const exists = prev.find(c => c.phone === customer.phone);
      if (exists) return prev;

      const updated = [
        ...prev,
        {
          id: Date.now(),
          name: customer.name || "",
          phone: customer.phone,
        },
      ];

      localStorage.setItem("customers", JSON.stringify(updated));
      return updated;
    });
  };

  return { customers, addCustomer };
}