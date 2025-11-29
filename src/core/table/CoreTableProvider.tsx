"use client";

import { ReactNode, useEffect, useState } from "react";
import { CoreTableContext } from "./CoreTableContext";
import { ColumnDef } from "@tanstack/react-table";

interface Props<T> {
  resource: string;
  columns: ColumnDef<T>[];
  children: ReactNode;
}

export function CoreTableProvider<T>({
  resource,
  columns,
  children,
}: Props<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, any>>({});

  async function loadData() {
    setLoading(true);
    try {
      // const query = new URLSearchParams(filters as any).toString();
      // const res = await fetch(`${resource}?${query}`);
      // const json = await res.json();
      // setData(json);

      console.log("Aqui deve ajustar para chamada para API");
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [resource, JSON.stringify(filters)]);

  return (
    <CoreTableContext.Provider
      value={{
        data,
        setData,
        resource,
        reload: loadData,
        loading,
        filters,
        setFilters,
        columns,
      }}
    >
      {children}
    </CoreTableContext.Provider>
  );
}
