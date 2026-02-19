"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { http } from "../utils/http.util";
import { QuerySchemaType, TableFiltersInterface } from "../utils/resource.util";
import { makeTableQueryParams } from "../utils/table.util";
import { ColumnFilter, CoreTableContext, PaginationState } from "./CoreTableContext";

interface InitialData<T> {
  data: T[];
  total: number;
}

interface Props<T> {
  resource: string;
  queryResources?: QuerySchemaType;
  columns: ColumnDef<T>[];
  filterConfig?: TableFiltersInterface<any>;
  initialData?: InitialData<T>;
  children: ReactNode;
}

export function CoreTableProvider<T>({
  resource,
  queryResources,
  columns,
  filterConfig,
  initialData = undefined,
  children,
}: Props<T>) {
  const [data, setData] = useState<T[]>(initialData?.data ?? []);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(initialData?.total ?? 0);
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([]);
  const [autoLoadData, setAutoLoadData] = useState(!initialData);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = makeTableQueryParams(resource, pagination, filters, sorting, queryResources);
      const getResponse = await http.get(resource, queryParams);

      setData(getResponse.data || []);
      setTotalRecords(getResponse.total || 0);
    } finally {
      setLoading(false);
    }
  }, [resource, pagination, filters, sorting]);

  useEffect(() => {
    if (!autoLoadData) {
      setAutoLoadData(true);
      return;
    }

    loadData();
  }, [pagination, filters, sorting]);

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
