"use client";

import { useState } from "react";

export default function ProductManager({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const handleSubmit = () => {
    if (editId) {
      updateProduct(editId, { name,category, price });
      setEditId(null);
    } else {
      addProduct({ name,category, price });
    }

    setName("");
    setCategory("");
    setPrice("");
  };

  const handleEdit = (item) => {
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price);
    setEditId(item.id);
  };

  return (
    <div className="p-3">

      {/* 🔹 Add / Edit Form */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">

        <h2 className="text-lg font-bold mb-2 text-black">
          {editId ? "Edit Product" : "Add Product"}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="w-full border p-3 rounded mb-2 text-black"
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded mb-2 text-black"

        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full border p-3 rounded mb-2 text-black"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white p-3 rounded-xl"
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* 🔹 Product List */}
      <div className="bg-white p-3 rounded-xl shadow">

        <h2 className="text-lg font-bold mb-2 text-black">
          Products
        </h2>

        {(!products || products.length === 0) && (
          <p className="text-black">No products yet</p>
        )}

        {products.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-medium text-black">{item.name}</p>
              <p className="font-medium text-black">{item.category}</p>
              <p className="text-sm text-black">₹{item.price}</p>
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => handleEdit(item)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}