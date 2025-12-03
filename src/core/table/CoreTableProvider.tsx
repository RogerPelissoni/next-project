"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { CoreTableContext, ColumnFilter, PaginationState } from "./CoreTableContext";
import { ColumnDef } from "@tanstack/react-table";
import { TableFiltersInterface } from "@/types/core.types";

interface Props<T> {
  resource: string;
  columns: ColumnDef<T>[];
  filterConfig?: TableFiltersInterface;
  children: ReactNode;
}

export function CoreTableProvider<T>({
  resource,
  columns,
  filterConfig,
  children,
}: Props<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        resource,
        skip: String(pagination.pageIndex * pagination.pageSize),
        take: String(pagination.pageSize),
      });

      // Consolidar filtros em um único objeto JSON e enviar como `filters`.
      if (filters.length > 0) {
        const filtersPayload: Record<string, { value: any; matchMode?: string }> = {};
        filters.forEach((filter) => {
          filtersPayload[filter.columnId] = {
            value: filter.value,
            ...(filter.matchMode ? { matchMode: filter.matchMode } : {}),
          };
        });

        params.append("filters", JSON.stringify(filtersPayload));
      }

      // Adicionar ordenação
      if (sorting.length > 0) {
        const { id, desc } = sorting[0];
        params.append("sortBy", id);
        params.append("sortOrder", desc ? "desc" : "asc");
      }

      const res = await fetch(`/api/get?${params.toString()}`);
      const json = await res.json();

      setData(json.data || []);
      setTotalRecords(json.total || 0);
    } finally {
      setLoading(false);
    }
  }, [resource, pagination, filters, sorting]);

  const filtersJson = JSON.stringify(filters);
  const sortingJson = JSON.stringify(sorting);

  useEffect(() => {
    loadData();
  }, [resource, pagination, filtersJson, sortingJson, loadData]);

  return (
    <CoreTableContext.Provider
      value={{
        data,
        setData,
        resource,
        reload: loadData,
        loading,
        totalRecords,
        filters,
        setFilters,
        filterConfig,
        pagination,
        setPagination,
        sorting,
        setSorting,
        columns,
      }}
    >
      {children}
    </CoreTableContext.Provider>
  );
}
