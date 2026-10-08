"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { buildInitialData } from "./mockData";
import type { StoreData } from "./types";

const STORAGE_KEY = "venta-huevos:data:v1";

type Updater = (prev: StoreData) => StoreData;

type StoreCtx = {
  data: StoreData;
  hydrated: boolean;
  update: (fn: Updater) => void;
  reset: () => void;
};

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreData>(() => buildInitialData());
  const [hydrated, setHydrated] = useState(false);
  const skipPersistRef = useRef(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoreData;
        setData(parsed);
      }
    } catch {
      // ignorar JSON corrupto
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignorar (quota)
    }
  }, [data, hydrated]);

  const update = useCallback((fn: Updater) => {
    setData((prev) => fn(prev));
  }, []);

  const reset = useCallback(() => {
    const fresh = buildInitialData();
    setData(fresh);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // ignorar
    }
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({ data, hydrated, update, reset }),
    [data, hydrated, update, reset]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useStore debe usarse dentro de <StoreProvider>");
  }
  return ctx;
}

export function nextId<T extends { id: number }>(items: T[]): number {
  return items.reduce((max, it) => (it.id > max ? it.id : max), 0) + 1;
}
