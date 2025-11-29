"use client";

import { createContext } from "react";
import { ColumnDef } from "@tanstack/react-table";

export interface CoreTableContextType<T> {
  data: T[];
  setData: (d: T[]) => void;

  resource: string;
  reload: () => Promise<void>;

  loading: boolean;

  columns: ColumnDef<T>[];

  filters: Record<string, any>;
  setFilters: (f: Record<string, any>) => void;
}

export const CoreTableContext = createContext<CoreTableContextType<any> | null>(
  null
);
