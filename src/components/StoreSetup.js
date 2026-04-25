"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

export default function StoreSetup({ createStore }) {
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [verified, setVerified] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isValidUPI = (upi) =>
    /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upi);

  const upiLink = `upi://pay?pa=${upiId}&pn=Verify&am=1&cu=INR`;

  const handleVerify = () => {
    if (!isValidUPI(upiId)) {
      alert("Enter valid UPI ID first");
      return;
    }

    if (isMobile) {
      window.location.href = upiLink;

      setTimeout(() => {
        const ok = confirm(
          "Did you verify the receiver name is correct?"
        );
        if (ok) setVerified(true);
      }, 1500);
    } else {
      setShowQR(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">

      {/* 🔥 CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white border rounded-2xl shadow-xl p-6"
      >

        {/* BRAND */}
        <h1 className="text-2xl text-black font-bold text-center">
          EasyBilling POS
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Setup your shop in under 30 seconds
        </p>

        {/* TITLE */}
        <h2 className="text-lg font-semibold mb-4 text-black">
          Create Your Store
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!name) return alert("Enter store name");
            if (!isValidUPI(upiId)) return alert("Enter valid UPI ID");
            if (!verified) return alert("Please verify your UPI");

            createStore({ name, upiId });
          }}
          className="space-y-4"
        >

          {/* STORE NAME */}
          <div>
            <label className="text-sm text-gray-600">
              Store Name
            </label>
            <input
              placeholder="e.g. Brar Dairy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1 text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* UPI */}
          <div>
            <label className="text-sm text-gray-600">
              UPI ID
            </label>
            <input
              placeholder="example@upi"
              value={upiId}
              onChange={(e) => {
                setUpiId(e.target.value);
                setVerified(false);
                setShowQR(false);
              }}
              className="w-full border p-3 rounded-xl mt-1 text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* VERIFY BUTTON */}
          <button
            type="button"
            onClick={handleVerify}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Verify UPI
          </button>

          {/* QR (PC) */}
          {showQR && !isMobile && (
            <div className="text-center bg-gray-50 p-3 rounded-xl">
              <p className="text-sm mb-2">
                Scan QR to verify receiver name
              </p>

              <div className="flex justify-center">
                <QRCodeCanvas value={upiLink} size={140} />
              </div>

              <button
                type="button"
                onClick={() => {
                  const ok = confirm(
                    "Receiver name correct?"
                  );
                  if (ok) setVerified(true);
                }}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                I Verified
              </button>
            </div>
          )}

          {/* STATUS */}
          {verified && (
            <p className="text-green-600 text-sm">
              ✔ UPI Verified Successfully
            </p>
          )}

          {!verified && upiId && (
            <p className="text-red-500 text-sm">
              ⚠ Verification required
            </p>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={!verified}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${
              verified
                ? "bg-black hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Start Billing →
          </button>

          {/* TRUST */}
          <p className="text-xs text-gray-500 text-center mt-2">
            No signup • No fees • Works offline
          </p>

        </form>
      </motion.div>
    </div>
  );
}