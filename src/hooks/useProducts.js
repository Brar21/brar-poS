import { useEffect, useState } from "react";
import { initDB } from "../lib/db";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

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

  const addProduct = async (data) => {
    if (!data.name || !data.category || !data.price) {
      alert("Enter name & category & price");
      return;
    }

    const db = await initDB();
    const tx = db.transaction("products", "readwrite");

    const item = {
      id: Date.now(),
      name: data.name.trim(), category: data.category,
      price: Number(data.price),
      createdAt: new Date().toISOString(),
    };

    tx.objectStore("products").put(item);

    tx.oncomplete = loadProducts;
  };

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
        name: data.name.trim(),
        price: Number(data.price),category: data.category,
        updatedAt: new Date().toISOString(),
      };

      store.put(updated);
    };

    tx.oncomplete = loadProducts;
  };

  const deleteProduct = async (id) => {
    const db = await initDB();
    const tx = db.transaction("products", "readwrite");

    tx.objectStore("products").delete(id);
    tx.oncomplete = loadProducts;
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}