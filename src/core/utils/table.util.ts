import { ColumnFilter, PaginationState } from "../table/CoreTableContext";

export function makeTableQueryParams(
  resource: string,
  pagination: PaginationState,
  filters: ColumnFilter[],
  sorting: Array<{ id: string; desc: boolean }>,
) {
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

  return queryParams;
}
