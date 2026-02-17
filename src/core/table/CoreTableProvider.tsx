"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { http } from "../utils/http.util";
import { QuerySchemaType, TableFiltersInterface } from "../utils/resource.util";
import { makeTableQueryParams } from "../utils/table.util";
import { ColumnFilter, CoreTableContext, PaginationState } from "./CoreTableContext";

interface Props<T> {
  resource: string;
  queryResources?: QuerySchemaType;
  columns: ColumnDef<T>[];
  filterConfig?: TableFiltersInterface<any>;
  setInitialData?: boolean;
  children: ReactNode;
}

export function CoreTableProvider<T>({
  resource,
  queryResources,
  columns,
  filterConfig,
  setInitialData = true,
  children,
}: Props<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([]);
  const [skipInitialLoad, setSkipInitialLoad] = useState(true);

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
    if (!setInitialData) {
      if (skipInitialLoad) {
        setSkipInitialLoad(false);
        return;
      }
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
