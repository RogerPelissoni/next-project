"use client";
import { useContext } from "react";
import { CoreTableContext } from "./CoreTableContext";

export function useCoreTable<T>() {
  const ctx = useContext(CoreTableContext);

  if (!ctx) {
    throw new Error("useCoreTable must be used inside CoreTableProvider");
  }

  return ctx;
}
