"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function EditStoreModal({ store, onClose, onSave }) {
  const [upiId, setUpiId] = useState(store.upiId || "");
  const [verified, setVerified] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isValidUPI = (upi) =>
    /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upi);

  const upiLink = `upi://pay?pa=${upiId}&pn=Verify&am=1&cu=INR`;

  const handleVerify = () => {
    if (!isValidUPI(upiId)) {
      alert("Invalid UPI");
      return;
    }

    if (isMobile) {
      window.location.href = upiLink;

      setTimeout(() => {
        if (confirm("Receiver name correct?")) {
          setVerified(true);
        }
      }, 1500);
    } else {
      setShowQR(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl w-[350px] text-black">

        <h2 className="text-lg font-bold mb-3">Edit UPI</h2>

        <input
          value={upiId}
          onChange={(e) => {
            setUpiId(e.target.value);
            setVerified(false);
            setShowQR(false);
          }}
          className="border p-2 w-full mb-3 rounded"
        />

        <button
          onClick={handleVerify}
          className="bg-blue-600 text-white w-full py-2 rounded mb-3"
        >
          Verify UPI
        </button>

        {/* PC QR */}
        {showQR && !isMobile && (
          <div className="text-center mb-3">
            <QRCodeCanvas value={upiLink} size={140} />
            <button
              onClick={() => setVerified(true)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              I Verified
            </button>
          </div>
        )}

        {verified && (
          <p className="text-green-600 text-sm mb-2">
            ✔ Verified
          </p>
        )}

        <div className="flex gap-2 mt-3">

          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 py-2 rounded"
          >
            Cancel
          </button>

          <button
            disabled={!verified}
            onClick={() => onSave(upiId)}
            className={`flex-1 py-2 text-white rounded ${
              verified ? "bg-black" : "bg-gray-400"
            }`}
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
}