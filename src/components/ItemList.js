"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ItemList({ products, addToCart }) {

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  // ✅ UNIQUE CATEGORIES
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // ✅ FILTER PRODUCTS
  const filteredProducts = products.filter((p) => {

    const matchCategory = selectedCategory
      ? p.category === selectedCategory
      : true;

    const searchText = search.toLowerCase();

    const matchSearch =
      p.name?.toLowerCase().includes(searchText) ||
      p.barcode?.toLowerCase().includes(searchText) ||
      p.hsn?.toLowerCase().includes(searchText);

    return matchCategory && matchSearch;
  });

  // ✅ MOBILE CAMERA SCANNER
  useEffect(() => {

    if (!scannerOpen) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(

      // SUCCESS
      (decodedText) => {

        setSearch(decodedText);

        // ✅ AUTO FIND PRODUCT
        const found = products.find(
          (p) =>
            p.barcode?.toString() === decodedText.toString()
        );

        // ✅ AUTO ADD TO CART
        if (found) {
          addToCart(found);
        }

        scanner.clear();
        setScannerOpen(false);
      },

      // ERROR
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };

  }, [scannerOpen, products, addToCart]);

  // ✅ BARCODE GUN SUPPORT
  useEffect(() => {

    const handleScannerGun = (e) => {

      // Scanner guns press ENTER automatically
      if (e.key === "Enter") {

        const found = products.find(
          (p) =>
            p.barcode?.toString() === search.toString()
        );

        if (found) {
          addToCart(found);
        }
      }
    };

    window.addEventListener("keydown", handleScannerGun);

    return () => {
      window.removeEventListener("keydown", handleScannerGun);
    };

  }, [search, products, addToCart]);

  return (
    <div className="w-full md:w-2/3 p-3 md:p-4 overflow-y-auto bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">

        <div>
          <h2 className="text-2xl font-bold text-black">
            🛒 Products
          </h2>

          <p className="text-gray-500 text-sm">
            {filteredProducts.length} Items
          </p>
        </div>

      </div>

      {/* SEARCH + SCANNER */}
      <div className="flex gap-2 mb-5">

        <input
          type="text"
          placeholder="Search name / barcode / HSN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            flex-1
            bg-white
            border
            border-gray-300
            rounded-2xl
            p-3
            text-black
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />

        {/* CAMERA BUTTON */}
        <button
          onClick={() => setScannerOpen(true)}
          className="
            bg-black
            text-white
            px-5
            rounded-2xl
            hover:scale-105
            active:scale-95
            transition
          "
        >
          📷
        </button>

      </div>

      {/* CATEGORY FILTER */}
      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">

        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition ${
            selectedCategory === ""
              ? "bg-black text-white"
              : "bg-white border text-black"
          }`}
        >
          All
        </button>

        {categories.map((c, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition ${
              selectedCategory === c
                ? "bg-black text-white"
                : "bg-white border text-black"
            }`}
          >
            {c}
          </button>
        ))}

      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-lg">
              No products found
            </p>
          </div>
        )}

        {filteredProducts.map((item) => (
          <button
            key={item.id}
            onClick={() => addToCart(item)}
            className="
              group
              bg-white
              rounded-3xl
              overflow-hidden
              shadow-sm
              hover:shadow-xl
              border
              transition-all
              duration-200
              active:scale-95
              text-left
            "
          >

            {/* PRODUCT IMAGE */}
            <div className="relative w-full h-40 bg-gray-100 overflow-hidden">

              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-105
                    transition
                    duration-300
                  "
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}

              {/* CATEGORY BADGE */}
              {item.category && (
                <div className="absolute top-2 left-2">
                  <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
              )}

            </div>

            {/* DETAILS */}
            <div className="p-3">

              {/* NAME */}
              <p className="font-semibold text-black text-sm line-clamp-2 min-h-[40px]">
                {item.name}
              </p>

              {/* PRICE */}
              <div className="flex justify-between items-center mt-2">

                <p className="text-xl font-bold text-black">
                  ₹{item.price}
                </p>

                <div className="bg-black text-white text-xs px-3 py-1 rounded-full">
                  ADD
                </div>

              </div>

              {/* BARCODE */}
              {item.barcode && (
                <p className="text-[11px] text-gray-500 mt-2 truncate">
                  Barcode: {item.barcode}
                </p>
              )}

              {/* HSN */}
              {item.hsn && (
                <p className="text-[11px] text-gray-500 truncate">
                  HSN: {item.hsn}
                </p>
              )}

            </div>

          </button>
        ))}

      </div>

      {/* ✅ SCANNER MODAL */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl p-4 w-full max-w-md">

            <div className="flex justify-between items-center mb-3">

              <h2 className="font-bold text-lg">
                Scan Barcode
              </h2>

              <button
                onClick={() => setScannerOpen(false)}
                className="text-xl"
              >
                ✕
              </button>

            </div>

            {/* CAMERA SCANNER */}
            <div id="reader" />

          </div>

        </div>
      )}

    </div>
  );
}