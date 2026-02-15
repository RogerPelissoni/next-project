"use client";

import { TableFiltersInterface } from "@/core/types/core.types";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { http } from "../utils/http.util";
import { makeTableQueryParams } from "../utils/table.util";
import { ColumnFilter, CoreTableContext, PaginationState } from "./CoreTableContext";

interface Props<T> {
  resource: string;
  columns: ColumnDef<T>[];
  filterConfig?: TableFiltersInterface;
  children: ReactNode;
}

export function CoreTableProvider<T>({ resource, columns, filterConfig, children }: Props<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = makeTableQueryParams(resource, pagination, filters, sorting);
      const getResponse = await http.get(resource, queryParams);
      setData(getResponse.data || []);
      setTotalRecords(getResponse.total || 0);
    } finally {
      setLoading(false);
    }
  }, [resource, pagination, filters, sorting]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <CoreTableContext.Provider
      value={{
        data,
        setData,
        resource,
        reload: loadData,
        loading,
        totalRecords,
        setTotalRecords,
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
