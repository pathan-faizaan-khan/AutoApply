"use client";

import React, { createContext, useContext, useRef, ReactNode } from "react";

interface CacheContextType {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CacheContext = createContext<CacheContextType | null>(null);

export function CacheProvider({ children }: { children: ReactNode }) {
  const cacheRef = useRef<Map<string, any>>(new Map());

  const get = (key: string) => cacheRef.current.get(key);
  const set = (key: string, value: any) => {
    cacheRef.current.set(key, value);
  };
  const remove = (key: string) => {
    cacheRef.current.delete(key);
  };
  const clear = () => {
    cacheRef.current.clear();
  };

  return (
    <CacheContext.Provider value={{ get, set, remove, clear }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useGlobalCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error("useGlobalCache must be used within a CacheProvider");
  }
  return context;
}
