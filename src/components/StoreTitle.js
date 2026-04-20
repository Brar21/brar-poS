"use client";

import { useEffect } from "react";
import useStore from "@/hooks/useStore";

export default function StoreTitle() {
  const { store } = useStore();

  useEffect(() => {
    if (store?.name) {
      document.title = `${store.name} - POS System`;
    }
  }, [store]);

  return null;
}