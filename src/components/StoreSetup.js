"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function StoreSetup({ createStore }) {
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [verified, setVerified] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isValidUPI = (upi) =>
    /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upi);

  const upiLink = `upi://pay?pa=${upiId}&pn=Verify&am=1&cu=INR`;

  const handleVerify = () => {
    if (!isValidUPI(upiId)) {
      alert("Enter valid UPI ID first");
      return;
    }

    if (isMobile) {
      // 📱 MOBILE → open UPI app
      window.location.href = upiLink;

      setTimeout(() => {
        const ok = confirm(
          "Did you verify the receiver name is correct?"
        );
        if (ok) setVerified(true);
      }, 1500);
    } else {
      // 💻 PC → show QR
      setShowQR(true);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-400 p-4">

      <div className="bg-white text-black p-6 rounded-2xl shadow w-full max-w-sm">

        <h1 className="text-xl text-center mb-4">
          Create Your Store
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!name) {
              alert("Enter store name");
              return;
            }

            if (!isValidUPI(upiId)) {
              alert("Enter valid UPI ID");
              return;
            }

            if (!verified) {
              alert("Please verify your UPI");
              return;
            }

            createStore({ name, upiId });
          }}
          className="flex flex-col"
        >

          {/* STORE NAME */}
          <input
            placeholder="Store Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 p-3 rounded-lg mb-3"
          />

          {/* UPI INPUT */}
          <input
            placeholder="UPI ID (example@upi)"
            value={upiId}
            onChange={(e) => {
              setUpiId(e.target.value);
              setVerified(false);
              setShowQR(false);
            }}
            className="border-2 p-3 rounded-lg mb-3"
          />

          {/* VERIFY BUTTON */}
          <button
            type="button"
            onClick={handleVerify}
            className="bg-blue-600 text-white p-3 rounded-lg mb-3"
          >
            Verify UPI
          </button>

          {/* 💻 QR FOR PC */}
          {showQR && !isMobile && (
            <div className="text-center mb-3">
              <p className="text-sm mb-2">
                Scan this QR with your phone to verify
              </p>

              <div className="flex justify-center">
                <QRCodeCanvas value={upiLink} size={140} />
              </div>

              <button
                type="button"
                onClick={() => {
                  const ok = confirm(
                    "Did you verify the receiver name is correct?"
                  );
                  if (ok) setVerified(true);
                }}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
              >
                I Verified
              </button>
            </div>
          )}

          {/* STATUS */}
          {verified && (
            <p className="text-green-600 text-sm mb-2">
              ✔ UPI Verified
            </p>
          )}

          {!verified && upiId && (
            <p className="text-red-500 text-sm mb-2">
              ⚠ Please verify your UPI
            </p>
          )}

          {/* CREATE BUTTON */}
          <button
            type="submit"
            disabled={!verified}
            className={`p-3 rounded-lg text-white ${
              verified ? "bg-black" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Create Store
          </button>

        </form>
      </div>
    </div>
  );
}