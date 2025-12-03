"use client";

import { Input } from "@/components/ui/input";
import { useCoreTable } from "./useCoreTable";
import { ColumnFilter } from "./CoreTableContext";

interface Props {
  columnId: string;
  placeholder?: string;
}

export function CoreTableColumnFilter({ columnId, placeholder = "Filtrar..." }: Props) {
  const { filters, setFilters } = useCoreTable();

  const currentFilter = filters.find((f) => f.columnId === columnId);
  const currentValue = currentFilter?.value ?? "";

  const handleChange = (value: string) => {
    setFilters((prevFilters: ColumnFilter[]) => {
      if (!value) {
        // Remove filter if empty
        return prevFilters.filter((f) => f.columnId !== columnId);
      }

      // Check if filter already exists
      const exists = prevFilters.some((f) => f.columnId === columnId);

      if (exists) {
        // Update existing filter
        return prevFilters.map((f) =>
          f.columnId === columnId ? { columnId, value } : f
        );
      }

      // Add new filter
      return [...prevFilters, { columnId, value }];
    });
  };

  return (
    <Input
      placeholder={placeholder}
      value={currentValue}
      onChange={(e) => handleChange(e.target.value)}
      className="max-w-sm"
    />
  );
}
