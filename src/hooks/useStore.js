import { useState, useEffect } from "react";
import { initDB } from "../lib/db";

export default function useStore() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStore();
  }, []);

  const loadStore = async () => {
    const db = await initDB();
    const tx = db.transaction("store", "readonly");
    const request = tx.objectStore("store").get("main");

    request.onsuccess = () => {
      setStore(request.result || null);
      setLoading(false);
    };
  };

  const createStore = async (name) => {
    if (!name) {
      alert("Enter store name");
      return;
    }

    const db = await initDB();

    const txCheck = db.transaction("store", "readonly");
    const existingReq = txCheck.objectStore("store").get("main");

    existingReq.onsuccess = () => {
      if (existingReq.result) {
        alert("Store already exists on this device");
        return;
      }

      const tx = db.transaction("store", "readwrite");

      const newStore = {
        id: "main",
        name,
        createdAt: new Date().toISOString(),
      };

      tx.objectStore("store").put(newStore);
      setStore(newStore);
    };
  };

  return { store, createStore, loading };
}