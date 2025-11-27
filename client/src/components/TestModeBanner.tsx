import { useState, useEffect } from "react";
import { isTestModeActive, disableTestMode } from "@/lib/testMode";
import { X } from "lucide-react";

export function TestModeBanner() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(isTestModeActive());
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-black px-4 py-2 flex items-center justify-between z-50">
      <span className="text-sm font-medium">
        🧪 Test Mode Active - All features unlocked
      </span>
      <button
        onClick={() => {
          disableTestMode();
          setIsActive(false);
        }}
        className="flex items-center gap-1 text-sm font-medium hover:underline"
        data-testid="button-disable-test-mode"
      >
        <X className="w-4 h-4" />
        Turn Off
      </button>
    </div>
  );
}
