"use client";

import { useReactTable, getCoreRowModel, flexRender, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCoreTable } from "./useCoreTable";

export function CoreTableComponent<TData>() {
  const { data, columns, loading, totalRecords, pagination, setPagination, sorting, setSorting, filters, setFilters, filterConfig } = useCoreTable<TData>();
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const memoColumns = useMemo(() => columns as ColumnDef<TData>[], [columns]);
  const memoData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: {
      sorting: sorting as SortingState,
      columnFilters: [],
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting.map((s) => ({ id: s.id, desc: s.desc })));
    },
    onColumnFiltersChange: () => {},

    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const pageCount = Math.ceil(totalRecords / pagination.pageSize);

  const handleFilterChange = (columnId: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: value,
    }));

    if (value === "" || value === undefined) {
      setFilters(filters.filter((f) => f.columnId !== columnId));
    } else {
        const matchMode = filterConfig?.[columnId]?.matchMode;
      const existingFilter = filters.find((f) => f.columnId === columnId);
      if (existingFilter) {
        setFilters(
          filters.map((f) => (f.columnId === columnId ? { ...f, value, matchMode } : f))
        );
      } else {
        setFilters([...filters, { columnId, value, matchMode }]);
      }
    }
  };

  const renderFilterInput = (columnId: string) => {
    const config = filterConfig?.[columnId];
    if (!config) return null;

    const currentValue = filterValues[columnId] || "";

    switch (config.type) {
      case "text":
        return (
          <Input
            key={`filter-${columnId}`}
            placeholder={config.placeholder || `Filtrar ${config.label || columnId}`}
            value={currentValue}
            onChange={(e) => handleFilterChange(columnId, e.target.value)}
            className="h-9"
          />
        );

      case "select":
        return (
          <Select key={`filter-${columnId}`} value={currentValue} onValueChange={(value) => handleFilterChange(columnId, value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder={config.placeholder || `Selecionar ${config.label || columnId}`} />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "number":
        return (
          <Input
            key={`filter-${columnId}`}
            type="number"
            placeholder={config.placeholder || `Filtrar ${config.label || columnId}`}
            value={currentValue}
            onChange={(e) => handleFilterChange(columnId, e.target.value)}
            className="h-9"
          />
        );

      case "date":
        return (
          <Input
            key={`filter-${columnId}`}
            type="date"
            value={currentValue}
            onChange={(e) => handleFilterChange(columnId, e.target.value)}
            className="h-9"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Filtros */}
      {filterConfig && Object.keys(filterConfig).length > 0 && (
        <div className="border rounded-md p-4 bg-muted/30">
          <h3 className="text-sm font-semibold mb-3">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(filterConfig).map(([columnId]) => (
              <div key={columnId} className="flex flex-col gap-1">
                {renderFilterInput(columnId)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                        onClick={() => {
                          if (header.column.getCanSort()) {
                            const isDesc = sorting[0]?.id === header.id && sorting[0]?.desc;
                            setSorting([{ id: header.id, desc: !isDesc }]);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          {/* Indicador de ordenação */}
                          {sorting[0]?.id === header.id && (sorting[0].desc ? " ↓" : " ↑")}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {data.length} de {totalRecords} resultados
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded border disabled:opacity-50 cursor-pointer hover:bg-muted"
                onClick={() => setPagination({ ...pagination, pageIndex: Math.max(0, pagination.pageIndex - 1) })}
                disabled={pagination.pageIndex === 0}
              >
                Anterior
              </button>

              <span className="text-sm">
                Página {pagination.pageIndex + 1} de {pageCount || 1}
              </span>

              <button
                className="px-3 py-1 rounded border disabled:opacity-50 cursor-pointer hover:bg-muted"
                onClick={() => setPagination({ ...pagination, pageIndex: Math.min(pageCount - 1, pagination.pageIndex + 1) })}
                disabled={pagination.pageIndex >= pageCount - 1}
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
