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
      <div className="w-full md:w-2/3 p-3 md:p-4 overflow-y-auto bg-gray-50">
    
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-black">
            Products
          </h2>
        </div>
    
        {/* CATEGORY FILTER (BUTTON STYLE - BETTER THAN DROPDOWN) */}
        <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
    
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
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
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    
          {filteredProducts.length === 0 && (
            <p className="text-gray-500 col-span-full text-center mt-10">
              No products found
            </p>
          )}
    
          {filteredProducts.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="
                bg-white
                border
                rounded-2xl
                shadow-sm
                p-4
                min-h-[120px]
                flex flex-col justify-between
                active:scale-95
                hover:shadow-md
                transition
              "
            >
              {/* NAME */}
              <p className="font-semibold text-black text-sm leading-tight">
                {item.name}
              </p>
    
              {/* PRICE */}
              <p className="text-lg font-bold text-black mt-2">
                ₹{item.price}
              </p>
    
              {/* CATEGORY TAG */}
              {item.category && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mt-2 w-fit text-gray-600">
                  {item.category}
                </span>
              )}
            </button>
          ))}
    
        </div>
      </div>
    );
}