import { KeyValueType, OptionType } from "@/core/utils/core.util";

export type FormFieldsInterface<T extends string, S> = {
  [K in T]: {
    fields: Record<keyof S, FieldInterface>;
  };
};

export interface FieldInterface {
  type: "text" | "password" | "select";
  label: string;
  disabled?: boolean;
  options?: OptionType[];
}

export type TableColumnInterface = TableColumnSingle[];

export interface TableColumnSingle {
  accessorKey: string;
  header: string;
  keyValue?: KeyValueType;
}

export type TableFilterType = "text" | "select" | "date" | "number" | "boolean";

export interface TableFilterConfig {
  type: TableFilterType;
  label?: string;
  placeholder?: string;
  matchMode?: "like" | "equals" | "contains" | "startsWith" | "endsWith";
  options?: { label: string; value: string | number }[];
}

export type TableFiltersInterface = Record<string, TableFilterConfig>;

export type MainDataPayload<TData> = {
  data: TData[];
  total: number;
};
