"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    setIsIOS(
      /iPhone|iPad|iPod/i.test(navigator.userAgent)
    );

    // Listen install event
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setPromptEvent(e);
    });
  }, []);

  const handleInstall = async () => {
    if (promptEvent) {
      promptEvent.prompt();
      await promptEvent.userChoice;
    } else if (isIOS) {
      alert("Tap Share → Add to Home Screen");
    } else {
      alert("Install not available on this browser");
    }
  };

  return (
    <button
      onClick={handleInstall}
      className="mt-2 w-full bg-green-600 text-white p-2 rounded"

    >
      Download App
    </button>
  );
}