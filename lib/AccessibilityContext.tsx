"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AccessibilityContextType {
  simplified: boolean;
  toggle: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  simplified: false,
  toggle: () => {},
});

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [simplified, setSimplified] = useState(false);

  return (
    <AccessibilityContext.Provider
      value={{ simplified, toggle: () => setSimplified((s) => !s) }}
    >
      <div className={simplified ? "text-lg leading-relaxed" : ""}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => useContext(AccessibilityContext);