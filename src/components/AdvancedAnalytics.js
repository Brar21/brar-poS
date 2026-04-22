"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function AdvancedAnalytics({ bills }) {
  const [filter, setFilter] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const now = new Date();

  // ✅ FILTER LOGIC
  const filteredBills = bills.filter((b) => {
    const d = new Date(b.date);

    if (filter === "today") {
      return d.toDateString() === now.toDateString();
    }

    if (filter === "month") {
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "custom" && fromDate && toDate) {
      return d >= new Date(fromDate) && d <= new Date(toDate);
    }

    return true;
  });

  // ✅ CATEGORY DATA
  const categoryMap = {};

  filteredBills.forEach((bill) => {
    bill.items?.forEach((item) => {
      const cat = item.category || "Other";

      if (!categoryMap[cat]) {
        categoryMap[cat] = 0;
      }

      categoryMap[cat] += item.price * item.qty;
    });
  });

  const data = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  // ✅ INSIGHTS
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = sorted[0];

  const cash = filteredBills
    .filter((b) => b.paymentMethod === "CASH")
    .reduce((s, b) => s + b.finalTotal, 0);

  const upi = filteredBills
    .filter((b) => b.paymentMethod === "UPI")
    .reduce((s, b) => s + b.finalTotal, 0);

  return (
    <div className="p-4">

      <h2 className="text-xl font-bold mb-4">Analytics</h2>

      {/* 🔥 FILTER */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <button onClick={() => setFilter("today")} className="bg-black text-white px-3 py-1 rounded">Today</button>
        <button onClick={() => setFilter("month")} className="bg-black text-white px-3 py-1 rounded">Month</button>
        <button onClick={() => setFilter("custom")} className="bg-black text-white px-3 py-1 rounded">Custom</button>
      </div>

      {filter === "custom" && (
        <div className="flex gap-2 mb-4">
          <input type="date" onChange={(e) => setFromDate(e.target.value)} className="border p-2 rounded"/>
          <input type="date" onChange={(e) => setToDate(e.target.value)} className="border p-2 rounded"/>
        </div>
      )}

      {/* 📊 BAR CHART */}
      <div className="bg-white p-3 rounded-xl shadow mb-4">
        <h3 className="font-bold mb-2">Category Revenue</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 PIE CHART */}
      <div className="bg-white p-3 rounded-xl shadow mb-4">
        <h3 className="font-bold mb-2">Category Share</h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
              {data.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 💡 INSIGHTS */}
      <div className="bg-yellow-100 p-3 rounded-xl">

        <h3 className="font-bold mb-2">Insights</h3>

        {top && (
          <p>🔥 Top Category: <b>{top.name}</b></p>
        )}

        <p>💰 Cash Sales: ₹{cash}</p>
        <p>📱 UPI Sales: ₹{upi}</p>

        {upi > cash && (
          <p className="text-green-700">UPI customers spend more 💡</p>
        )}

        {cash > upi && (
          <p className="text-blue-700">Cash still dominant 💡</p>
        )}

      </div>

    </div>
  );
}