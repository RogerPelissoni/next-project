"use client";

import { createContext } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableFiltersInterface } from "@/core/types/core.types";

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
  setData: React.Dispatch<React.SetStateAction<T[]>>;

  resource: string;
  reload: () => Promise<void>;

  loading: boolean;

  totalRecords: number;
  setTotalRecords: React.Dispatch<React.SetStateAction<number>>;

  columns: ColumnDef<T>[];

  filters: ColumnFilter[];
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;

  filterConfig?: TableFiltersInterface;

  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;

  sorting: Array<{ id: string; desc: boolean }>;
  setSorting: React.Dispatch<React.SetStateAction<Array<{ id: string; desc: boolean }>>>;
}

export const CoreTableContext = createContext<CoreTableContextType<any> | null>(null);
