"use client"
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

  const createStore = async (data) => {
    const { name, upiId } = data;
  
    if (!name) {
      alert("Enter store name");
      return;
    }
  
    if (!upiId || !upiId.includes("@")) {
      alert("Enter valid UPI ID");
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
        upiId, // 💥 NEW FIELD
        createdAt: new Date().toISOString(),
      };
  
      tx.objectStore("store").put(newStore);
      setStore(newStore);
    };
  };
  const deleteStore = async () => {
    const db = await initDB();
  
    const tx1 = db.transaction("store", "readwrite");
    tx1.objectStore("store").delete("main");
  
    const tx2 = db.transaction("products", "readwrite");
    tx2.objectStore("products").clear();
  
    localStorage.removeItem("bills");
  
    setStore(null);
  };
  const updateStore = async (updatedData) => {
    const db = await initDB();
  
    const tx = db.transaction("store", "readwrite");
  
    const updatedStore = {
      ...store,
      ...updatedData,
    };
  
    tx.objectStore("store").put(updatedStore);
  
    setStore(updatedStore);
  };
  return { store, createStore, deleteStore,loading,updateStore };
}