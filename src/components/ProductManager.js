"use client";

import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function ProductManager({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [hsn, setHsn] = useState("");
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState(null);

  // ✅ BARCODE SCANNER
  const [scannerOpen, setScannerOpen] = useState(false);

  // ✅ IMAGE UPLOAD
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // ✅ LIMIT SIZE
    if (file.size > 1024 * 1024) {
      alert("Image must be less than 1MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // ✅ ADD / UPDATE
  const handleSubmit = () => {
    if (!name || !price) {
      alert("Product name and price required");
      return;
    }

    const productData = {
      name,
      category,
      price: Number(price),
      barcode,
      hsn,
      image,
    };

    if (editId) {
      updateProduct(editId, productData);
      setEditId(null);
    } else {
      addProduct(productData);
    }

    // ✅ RESET
    setName("");
    setCategory("");
    setPrice("");
    setBarcode("");
    setHsn("");
    setImage("");
  };

  // ✅ EDIT
  const handleEdit = (item) => {
    setName(item.name || "");
    setCategory(item.category || "");
    setPrice(item.price || "");
    setBarcode(item.barcode || "");
    setHsn(item.hsn || "");
    setImage(item.image || "");
    setEditId(item.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();

        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");

          // ✅ MAX SIZE
          const MAX_WIDTH = 600;
          const scale = MAX_WIDTH / img.width;

          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // ✅ COMPRESS QUALITY
          const compressed = canvas.toDataURL("image/jpeg", 0.6);

          resolve(compressed);
        };
      };
    });
  };
  console.log(products)
  return (
    <div className="p-3">

      {/* 🔹 ADD / EDIT FORM */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">

        <h2 className="text-lg font-bold mb-3 text-black">
          {editId ? "Edit Product" : "Add Product"}
        </h2>

        {/* PRODUCT NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="w-full border p-3 rounded mb-2 text-black"
        />

        {/* CATEGORY */}
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full border p-3 rounded mb-2 text-black"
        />

        {/* PRICE */}
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full border p-3 rounded mb-2 text-black"
        />

        {/* BARCODE */}
        <input
          autoFocus
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Barcode (Optional)"
          className="w-full border p-3 rounded mb-2 text-black"
        />

        {/* SCAN BUTTON */}
        <button
          onClick={() => setScannerOpen(true)}
          className="w-full bg-blue-600 text-white p-2 rounded mb-2"
        >
          Scan Barcode
        </button>

        {/* HSN */}
        <input
          value={hsn}
          onChange={(e) => setHsn(e.target.value)}
          placeholder="HSN Code (Optional)"
          className="w-full border p-3 rounded mb-2 text-black"
        />

        {/* IMAGE PICKER */}
        <div className="mb-3">

          <label className="block text-sm font-medium mb-1 text-black">
            Product Photo (Optional)
          </label>

          <input
            type="file"
            accept="image/*"
          className="w-full border p-3 rounded mb-2 text-black"

            onChange={async (e) => {
              const file = e.target.files[0];

              if (!file) return;

              const compressedImage = await compressImage(file);

              setImage(compressedImage);
            }}
          />
        </div>

        {/* IMAGE PREVIEW */}
        {image && (
          <div className="mb-3">
            <img
              src={image}
              alt="preview"
              className="w-24 h-24 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white p-3 rounded-xl"
        >
          {editId ? "Update Product" : "Add Product"}
        </button>

      </div>

      {/* 🔹 PRODUCT LIST */}
      <div className="bg-white p-3 rounded-xl shadow">

        <h2 className="text-lg font-bold mb-3 text-black">
          Products
        </h2>

        {(!products || products.length === 0) && (
          <p className="text-black">No products yet</p>
        )}

        {products.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-3 gap-3"
          >

            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">

              {/* PRODUCT IMAGE */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                  No Img
                </div>
              )}

              {/* DETAILS */}
              <div>

                <p className="font-semibold text-black">
                  {item.name}
                </p>

                {item.category && (
                  <p className="text-sm text-gray-600">
                    {item.category}
                  </p>
                )}

                <p className="text-black font-medium">
                  ₹{item.price}
                </p>

                {item.barcode && (
                  <p className="text-xs text-gray-500">
                    Barcode: {item.barcode}
                  </p>
                )}

                {item.hsn && (
                  <p className="text-xs text-gray-500">
                    HSN: {item.hsn}
                  </p>
                )}

              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">

              <button
                onClick={() => handleEdit(item)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* 🔥 BARCODE SCANNER MODAL */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">

          <div className="bg-white p-4 rounded-xl w-full max-w-md">

            <h2 className="text-lg font-bold mb-3 text-black">
              Scan Barcode
            </h2>

            <BarcodeScannerComponent
              width={300}
              height={300}
              onUpdate={(err, result) => {
                if (result) {
                  setBarcode(result.text);
                  setScannerOpen(false);
                }
              }}
            />

            <button
              onClick={() => setScannerOpen(false)}
              className="w-full bg-red-500 text-white p-2 rounded mt-3"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}