"use client";

import { useState } from "react";

export default function ItemList({ products, addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  // ✅ UNIQUE CATEGORIES
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // ✅ FILTER PRODUCTS
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory
      ? p.category === selectedCategory
      : true;

    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(search.toLowerCase()) ||
      p.hsn?.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="w-full md:w-2/3 p-3 m-1 md:p-4 overflow-y-auto bg-gray-100 min-h-screen">

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

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search name / barcode / HSN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
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
            <div className="relative w-full h-36 bg-gray-100 overflow-hidden">

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

            {/* PRODUCT DETAILS */}
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
    </div>
  );
}