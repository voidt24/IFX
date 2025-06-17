// useIsPWA.ts
import { useEffect, useState } from "react";

export function useIsPWA(): boolean {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    const isIOSStandalone = "standalone" in window.navigator && window.navigator.standalone;
    setIsPWA(Boolean(standalone || isIOSStandalone));
  }, []);

  return isPWA;
}
