"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
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
  autoLoad?: boolean;
  initialData?: InitialData<T>;
  externalData?: T[];
  children: ReactNode;
}

export function CoreTableProvider<T>({
  resource,
  queryResources,
  columns,
  filterConfig,
  autoLoad = true,
  initialData,
  externalData,
  children,
}: Props<T>) {
  const isControlled = externalData !== undefined;

  const [internalData, setInternalData] = useState<T[]>(initialData?.data ?? []);
  const [totalRecords, setTotalRecords] = useState(initialData?.total ?? 0);

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([]);

  const data = useMemo(() => (isControlled ? externalData! : internalData), [isControlled, externalData, internalData]);

  const loadData = useCallback(async () => {
    if (isControlled) return;

    setLoading(true);
    try {
      const queryParams = makeTableQueryParams(resource, pagination, filters, sorting, queryResources);
      const response = await http.get(resource, queryParams);

      setInternalData(response.data || []);
      setTotalRecords(response.total || 0);
    } finally {
      setLoading(false);
    }
  }, [resource, pagination, filters, sorting, queryResources, isControlled]);

  useEffect(() => {
    if (!autoLoad || isControlled) return;
    loadData();
  }, [pagination, filters, sorting, autoLoad, isControlled, loadData]);

  useEffect(() => {
    if (isControlled) {
      setTotalRecords(externalData!.length);
    }
  }, [externalData, isControlled]);

  const setData = (value: T[]) => {
    if (isControlled) return;

    setInternalData(value);
    setTotalRecords(value.length);
  };

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
