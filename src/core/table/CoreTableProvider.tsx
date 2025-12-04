"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { CoreTableContext, ColumnFilter, PaginationState } from "./CoreTableContext";
import { ColumnDef } from "@tanstack/react-table";
import { TableFiltersInterface } from "@/core/types/core.types";
import { http } from "../utils/http.util";

interface Props<T> {
  resource: string;
  columns: ColumnDef<T>[];
  filterConfig?: TableFiltersInterface;
  children: ReactNode;
}

export function CoreTableProvider<T>({ resource, columns, filterConfig, children }: Props<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([]);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const queryParams = {
        resource,
        skip: String(pagination.pageIndex * pagination.pageSize),
        take: String(pagination.pageSize),
        filters: "",
        sortBy: "id",
        sortOrder: "asc",
      };

      // Filters
      if (filters.length > 0) {
        const filtersPayload: Record<string, { value: any; matchMode?: string }> = {};

        filters.forEach((filter) => {
          filtersPayload[filter.columnId] = {
            value: filter.value,
            ...(filter.matchMode ? { matchMode: filter.matchMode } : {}),
          };
        });

        queryParams.filters = JSON.stringify(filtersPayload);
      }

      // Sorting
      if (sorting.length > 0) {
        const { id, desc } = sorting[0];
        queryParams.sortBy = id;
        queryParams.sortOrder = desc ? "desc" : "asc";
      }

      const getResponse = await http.get(resource, queryParams);

      setData(getResponse.data || []);
      setTotalRecords(getResponse.total || 0);
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
