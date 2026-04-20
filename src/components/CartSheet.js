"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function CartSheet({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">

      <motion.div
        drag="y"
        dragConstraints={{ top: -500, bottom: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.y < -100) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
        animate={{ y: open ? "-60vh" : 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="
          fixed bottom-0 left-0 right-0
          bg-white rounded-t-2xl shadow-xl
          h-[400px] z-50
        "
      >

        {/* HANDLE */}
        <div className="w-12 h-1.5 bg-gray-400 rounded mx-auto my-2" />

        {/* CONTENT */}
        <div className="overflow-y-auto h-full p-2 pb-20">
          {children}
        </div>

      </motion.div>
    </div>
  );
}