"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setPrompt(e);
    });
  }, []);

  const installApp = () => {
    if (prompt) {
      prompt.prompt();
    }
  };

  if (!prompt) return null;

  return (
    <button
      onClick={installApp}
      className="bg-green-600 text-white px-3 py-1 rounded"
    >
      Install App
    </button>
  );
}