"use client";

import { useState } from "react";

export default function DeleteStoreModal({ onClose, onConfirm }) {
  const [text, setText] = useState("");

  const isValid = text === "DELETE";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-white text-black p-6 rounded-xl w-[350px] shadow-xl">

        <h2 className="text-xl font-bold text-red-600 mb-3">
          ⚠️ Delete Store
        </h2>

        <p className="text-sm mb-4">
          This will permanently delete:
          <br />• Store
          <br />• Products
          <br />• Bills
          <br /><br />
          <b>This action cannot be undone.</b>
        </p>

        <p className="text-sm mb-2">
          Type <b>DELETE</b> to confirm:
        </p>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Type DELETE"
        />

        <div className="flex gap-2">

          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 py-2 rounded"
          >
            Cancel
          </button>

          <button
            disabled={!isValid}
            onClick={onConfirm}
            className={`flex-1 py-2 rounded text-white ${
              isValid ? "bg-red-600" : "bg-red-300 cursor-not-allowed"
            }`}
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}