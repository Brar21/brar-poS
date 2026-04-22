"use client";

import { useState } from "react";

export default function ItemList({ products, addToCart }) {

  const [selectedCategory, setSelectedCategory] = useState("");

  // get unique categories
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // filter products
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div className="w-full md:w-2/3 p-2 md:p-4 overflow-y-auto">

      <h2 className="text-lg font-bold mb-2 text-black">
        Products
      </h2>

      {/* CATEGORY DROPDOWN */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 mb-3 rounded text-black"
      >
        <option value="">All Categories</option>
        {categories.map((c, i) => (
          <option key={i} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

        {filteredProducts.length === 0 && (
          <p className="text-black">No products</p>
        )}

        {filteredProducts.map((item) => (
          <button
            key={item.id}
            onClick={() => addToCart(item)}
            className="
              bg-white 
              rounded-2xl 
              shadow 
              p-4 
              min-h-[100px]
              flex flex-col justify-center
              active:scale-95
            "
          >
            <p className="font-bold text-black text-base">
              {item.name}
            </p>

            <p className="text-lg text-black">
              ₹{item.price}
            </p>

            {/* SHOW CATEGORY (optional) */}
            {item.category && (
              <p className="text-xs text-gray-500">
                {item.category}
              </p>
            )}
          </button>
        ))}

      </div>
    </div>
  );
}