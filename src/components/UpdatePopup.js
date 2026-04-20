"use client";

import { useEffect, useState } from "react";

export default function UpdatePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    window.addEventListener("app-update", () => {
      setShow(true);
    });
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black text-white p-4 rounded-xl flex justify-between items-center z-50">
      <span>New version available 🚀</span>

      <button
        onClick={() => window.location.reload()}
        className="bg-green-500 px-3 py-1 rounded"
      >
        Update
      </button>
    </div>
  );
}