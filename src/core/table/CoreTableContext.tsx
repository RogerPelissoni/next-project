"use client";

import { createContext } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableFiltersInterface } from "@/types/core.types";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface ColumnFilter {
  columnId: string;
  value: any;
  matchMode?: "like" | "equals" | "contains" | "startsWith" | "endsWith";
}

export interface CoreTableContextType<T> {
  data: T[];
  setData: (d: T[]) => void;

  resource: string;
  reload: () => Promise<void>;

  loading: boolean;
  totalRecords: number;

  columns: ColumnDef<T>[];

  filters: ColumnFilter[];
  setFilters: (f: ColumnFilter[]) => void;

  filterConfig?: TableFiltersInterface;

  pagination: PaginationState;
  setPagination: (p: PaginationState) => void;

  sorting: Array<{ id: string; desc: boolean }>;
  setSorting: (s: Array<{ id: string; desc: boolean }>) => void;
}

export const CoreTableContext = createContext<CoreTableContextType<any> | null>(
  null
);
