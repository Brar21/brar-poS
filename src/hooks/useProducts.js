import { useEffect, useState } from "react";
import { initDB } from "../lib/db";

export default function useProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ LOAD PRODUCTS
  const loadProducts = async () => {

    const db = await initDB();

    const tx = db.transaction("products", "readonly");

    const store = tx.objectStore("products");

    const req = store.getAll();

    req.onsuccess = () => {
      setProducts(req.result || []);
      setLoading(false);
    };
  };

  // ✅ ADD PRODUCT
  const addProduct = async (data) => {

    if (!data.name || !data.price) {
      alert("Enter product name & price");
      return;
    }

    const db = await initDB();

    const tx = db.transaction("products", "readwrite");

    const item = {
      id: Date.now(),

      // BASIC
      name: data.name?.trim() || "",
      category: data.category || "",
      price: Number(data.price) || 0,

      // ✅ NEW FIELDS
      barcode: data.barcode || "",
      hsn: data.hsn || "",
      image: data.image || "",

      createdAt: new Date().toISOString(),
    };

    tx.objectStore("products").put(item);

    tx.oncomplete = () => {
      loadProducts();
    };
  };

  // ✅ UPDATE PRODUCT
  const updateProduct = async (id, data) => {

    const db = await initDB();

    const tx = db.transaction("products", "readwrite");

    const store = tx.objectStore("products");

    const getReq = store.get(id);

    getReq.onsuccess = () => {

      const existing = getReq.result;

      if (!existing) return;

      const updated = {

        ...existing,

        // BASIC
        name: data.name?.trim() || "",
        category: data.category || "",
        price: Number(data.price) || 0,

        // ✅ NEW FIELDS
        barcode: data.barcode || "",
        hsn: data.hsn || "",
        image: data.image || "",

        updatedAt: new Date().toISOString(),
      };

      store.put(updated);
    };

    tx.oncomplete = () => {
      loadProducts();
    };
  };

  // ✅ DELETE PRODUCT
  const deleteProduct = async (id) => {

    const db = await initDB();

    const tx = db.transaction("products", "readwrite");

    tx.objectStore("products").delete(id);

    tx.oncomplete = () => {
      loadProducts();
    };
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}