export const DB_NAME = "brar-pos-db";
export const DB_VERSION = 2; // ⬅️ bump version when adding new store

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("store")) {
        db.createObjectStore("store", { keyPath: "id" });
      }

      // 🆕 products store
      if (!db.objectStoreNames.contains("products")) {
        const prod = db.createObjectStore("products", { keyPath: "id" });
        prod.createIndex("name", "name", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("DB Error");
  });
};