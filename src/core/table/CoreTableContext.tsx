"use client";

import { ColumnDef } from "@tanstack/react-table";
import { createContext } from "react";
import { TableFiltersInterface } from "../utils/resource.util";

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
  setData: (data: T[]) => void;

  resource: string;
  reload: () => Promise<void>;

  loading: boolean;

  totalRecords: number;
  setTotalRecords: (total: number) => void;

  columns: ColumnDef<T>[];

  filters: ColumnFilter[];
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;

  filterConfig?: TableFiltersInterface<any>;

  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;

  sorting: Array<{ id: string; desc: boolean }>;
  setSorting: React.Dispatch<React.SetStateAction<Array<{ id: string; desc: boolean }>>>;
}

export const CoreTableContext = createContext<CoreTableContextType<any> | null>(null);
