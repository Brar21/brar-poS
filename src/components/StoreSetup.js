"use client";

import { useState } from "react";

export default function StoreSetup({ createStore }) {
  const [name, setName] = useState("");

  return (
    <div className="
      h-screen 
      flex 
      items-center 
      justify-center 
      bg-gray-100
      p-4
    ">

      <div className="
        bg-white 
        p-6 
        rounded-2xl 
        shadow 
        w-full 
        max-w-sm
      ">

        <h1 className="text-xl font-bold text-center text-black mb-4">
          Create Your Store
        </h1>

        <input
          type="text"
          placeholder="Enter store name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full 
            border 
            p-3 
            rounded 
            mb-4 
            text-black
          "
        />

        <button
          onClick={() => createStore(name)}
          className="
            w-full 
            bg-black 
            text-white 
            p-3 
            rounded-xl 
            text-lg 
            active:scale-95
          "
        >
          Create Store
        </button>

      </div>
    </div>
  );
}