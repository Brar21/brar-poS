"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Cart from "./Cart";
export default function CartSheet({ children, cart, total }) {
  const [open, setOpen] = useState(false);
console.log(total,"kya {",cart.length)
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">

      {/* 🔽 COLLAPSED BAR */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          className="bg-black text-white m-4 p-4 rounded-xl flex justify-between items-center"
        >
         <div>
          <button className="font-bold text-white"> Tap Here</button>
         </div>

          <span>{cart.length} Items</span>
          <span className="font-bold text-white">₹{total}</span>
        </div>
      )}

      {/* 🔼 EXPANDED CART */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 200 }}
            className="
              bg-white 
              rounded-t-2xl 
              shadow-2xl
              h-[85vh]
              flex flex-col
            "
          >

            {/* HANDLE */}
            <div
              onClick={() => setOpen(false)}
              className="w-12 h-1.5 bg-gray-400 rounded mx-auto my-3"
            />

            {/* HEADER */}
            <div className="flex justify-between px-4 pb-2 border-b">
              <h2 className="font-bold text-lg">Cart</h2>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-3">
              {children}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}