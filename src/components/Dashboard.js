"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

export default function Dashboard({ bills }) {
    const [filter, setFilter] = useState("today");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const now = new Date();

    // ✅ SAFE DATE PARSER (IMPORTANT FIX)
    const getDate = (date) => {
        const d = new Date(date);
        return isNaN(d) ? new Date() : d;
    };

    // ✅ FILTER (FIXED PROPERLY)
    const filteredBills = bills.filter((b) => {
        const d = getDate(b.date);

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
            const from = new Date(fromDate);
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);

            return d >= from && d <= to;
        }

        return true;
    });

    // ✅ TOTALS
    const total = filteredBills.reduce((s, b) => s + (b.finalTotal || 0), 0);

    const cash = filteredBills
        .filter((b) => b.paymentMethod === "CASH")
        .reduce((s, b) => s + (b.finalTotal || 0), 0);

    const upi = filteredBills
        .filter((b) => b.paymentMethod === "UPI")
        .reduce((s, b) => s + (b.finalTotal || 0), 0);

    // ✅ PRODUCT SALES (TOP 5 ONLY → FIX GRAPH)
    const productMap = {};

    filteredBills.forEach((bill) => {
        bill.items?.forEach((item) => {
            const name = item.name || "Unknown";
            productMap[name] = (productMap[name] || 0) + (item.qty || 0);
        });
    });

    const productData = Object.keys(productMap)
        .map((key) => ({
            name: key,
            qty: productMap[key],
        }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5); // ✅ ONLY TOP 5

    const topProduct = productData[0];

    // ✅ SALES TREND (SORTED → FIX GRAPH)
    const trendMap = {};

    filteredBills.forEach((b) => {
        const d = getDate(b.date);
        const key = d.toISOString().slice(0, 10); // YYYY-MM-DD (clean)

        trendMap[key] = (trendMap[key] || 0) + (b.finalTotal || 0);
    });

    const trendData = Object.keys(trendMap)
        .sort() // ✅ VERY IMPORTANT
        .map((d) => ({
            date: d,
            total: trendMap[d],
        }));

    return (
        <div className="min-h-screen bg-white p-4 text-black">

            <h2 className="text-2xl font-bold mb-4">📊 Dashboard</h2>

            {/* FILTER */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={() => setFilter("today")} className="bg-black text-white px-3 py-1 rounded">Today</button>
                <button onClick={() => setFilter("month")} className="bg-black text-white px-3 py-1 rounded">Month</button>
                <button onClick={() => setFilter("custom")} className="bg-black text-white px-3 py-1 rounded">Custom</button>
            </div>

            {filter === "custom" && (
                <div className="flex gap-2 mb-4">
                    <input type="date" onChange={(e) => setFromDate(e.target.value)} className="border p-2" />
                    <input type="date" onChange={(e) => setToDate(e.target.value)} className="border p-2" />
                </div>
            )}

            {/* SUMMARY */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-green-300 p-4 text-center rounded">
                    <p>Total</p>
                    <h2>₹{total}</h2>
                </div>

                <div className="bg-blue-300 p-4 text-center rounded">
                    <p>Cash</p>
                    <h2>₹{cash}</h2>
                </div>

                <div className="bg-yellow-300 p-4 text-center rounded">
                    <p>UPI</p>
                    <h2>₹{upi}</h2>
                </div>
            </div>

            {/* SALES TREND */}
            <div className="bg-white shadow p-3 mb-4 border rounded">
                <h3 className="font-bold mb-2">📈 Sales Trend</h3>

                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={trendData}>
                        <XAxis dataKey="date" stroke="#000" />
                        <YAxis stroke="#000" />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="#000" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        {/* INSIGHTS */}
        <div className="bg-yellow-200 p-3 rounded mb-3">
                <h3 className="font-bold ">💡 Insights</h3>

                {topProduct && (
                    <p>🔥 Most Sold: <b>{topProduct.name}</b> ({topProduct.qty})</p>
                )}
                <div className="flex flex-row gap-5">
                    <p>Cash: ₹{cash}</p>
                    <p>UPI: ₹{upi}</p>
                </div>

                <div className="flex flex-row gap-5">
                    {upi > cash && <p>👉 UPI customers spend more</p>}
                    {cash > upi && <p>👉 Cash still dominant</p>}
                </div>


            </div>

            {/* TOP PRODUCTS */}
            <div className="bg-white shadow p-3 mb-4 border rounded">
                <h3 className="font-bold mb-2">🔥 Top 5 Products</h3>

                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={productData}>
                        <XAxis dataKey="name" stroke="#000" />
                        <YAxis stroke="#000" />
                        <Tooltip />
                        <Bar dataKey="qty" fill="#000" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

    
        </div>
    );
}