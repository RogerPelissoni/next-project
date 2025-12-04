"use client";

import { useReactTable, getCoreRowModel, flexRender, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@/components/ui/form";
import { CoreInputComponent } from "@/core/components/coreInput.component";
import { CoreSelectComponent } from "@/core/components/coreSelect.component";
import { CoreDateComponent } from "@/core/components/coreDate.component";
import CoreButtonComponent from "@/core/components/coreButton.component";
import { useCoreTable } from "./useCoreTable";

export function CoreTableComponent<TData>() {
  const { data, columns, loading, totalRecords, pagination, setPagination, sorting, setSorting, filters, setFilters, filterConfig } = useCoreTable<TData>();

  // TODO: O Filter também deverá possuir schema zod, pois podem ter campos obrigatórios
  const createFilterSchema = () => {
    if (!filterConfig || Object.keys(filterConfig).length === 0) {
      return z.object({});
    }

    const schemaObject: Record<string, z.ZodSchema> = {};

    Object.entries(filterConfig).forEach(([columnId, config]) => {
      let field: z.ZodSchema = z.string().optional();

      switch (config.type) {
        case "number":
          field = z.coerce.number().optional();
          break;
        case "date":
          field = z.string().optional();
          break;
        case "select":
          field = z.string().optional();
          break;
        case "boolean":
          field = z.boolean().optional();
          break;
        default:
          field = z.string().optional();
      }

      schemaObject[columnId] = field;
    });

    return z.object(schemaObject);
  };

  const filterSchema = createFilterSchema();
  type FilterFormValues = z.infer<typeof filterSchema>;

  const filterForm = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: Object.keys(filterConfig || {}).reduce((acc, key) => ({ ...acc, [key]: "" }), {}) as FilterFormValues,
    mode: "onChange",
  });

  const handleFilterClick = () => {
    const currentValues = filterForm.getValues();
    const newFilters: typeof filters = [];

    Object.entries(currentValues).forEach(([columnId, val]) => {
      if (val !== "" && val !== undefined && val !== null) {
        const matchMode = filterConfig?.[columnId]?.matchMode;
        newFilters.push({ columnId, value: String(val), matchMode });
      }
    });

    setFilters(newFilters);
  };

  // Handle Enter key press in text inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFilterClick();
    }
  };

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

  const renderFilterField = (columnId: string) => {
    const config = filterConfig?.[columnId];
    if (!config) return null;

    const commonProps = {
      control: filterForm.control as any,
      name: columnId as any,
      label: config.label,
      placeholder: config.placeholder || `Filtrar ${config.label || columnId}`,
    };

    switch (config.type) {
      case "text":
        return (
          <div key={`filter-${columnId}`} onKeyDown={handleKeyDown}>
            <CoreInputComponent {...commonProps} type="text" />
          </div>
        );

      case "number":
        return (
          <div key={`filter-${columnId}`} onKeyDown={handleKeyDown}>
            <CoreInputComponent {...commonProps} type="number" />
          </div>
        );

      case "select":
        return <CoreSelectComponent key={`filter-${columnId}`} {...commonProps} options={(config.options ?? []) as Array<{ label: string; value: string }>} />;

      case "date":
        return <CoreDateComponent key={`filter-${columnId}`} {...commonProps} />;

      default:
        return null;
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Filtros */}
      {filterConfig && Object.keys(filterConfig).length > 0 && (
        <Form {...filterForm}>
          <div className="border rounded-md p-4 bg-muted/30">
            <h3 className="text-sm font-semibold mb-3">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(filterConfig).map(([columnId]) => (
                <div key={columnId} className="flex flex-col gap-1">
                  {renderFilterField(columnId)}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <CoreButtonComponent label="Filtrar" onClick={handleFilterClick} />
            </div>
          </div>
        </Form>
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
                        <TableCell key={cell.id}>
                          {(() => {
                            const colDef: any = cell.column.columnDef;
                            const rawValue = cell.getValue() as string | number;

                            if (colDef.keyValue && rawValue !== undefined && rawValue !== null) {
                              return colDef.keyValue[rawValue] ?? rawValue;
                            }

                            return flexRender(colDef.cell, cell.getContext());
                          })()}
                        </TableCell>
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
