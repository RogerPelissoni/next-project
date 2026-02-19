import { KeyValueType, OptionType } from "./core.util";

// ===== QUERY_RESOURCES =====

export type QuerySchemaType = {
  fields: Record<string, any>;
  appends?: Record<string, any>;
  hydrators?: Record<string, any>;
};

export type QueryFields<TQueryResource extends QuerySchemaType> =
  | ExtractArray<TQueryResource["fields"]>
  | ExtractArrayIfExists<TQueryResource, "appends">;

export function createQueryResourceBuilder<TSchema extends QuerySchemaType>() {
  return function <
    const TFields extends readonly (keyof TSchema["fields"])[],
    const TAppends extends readonly (keyof TSchema["appends"])[] | undefined,
    const THydrators extends readonly (keyof TSchema["hydrators"])[] | undefined,
  >(options: { fields: TFields; appends: TAppends; hydrators: THydrators }) {
    return options;
  };
}

// ===== tableColumns =====

export type TableColumnInterface<TFields> = TableColumnSingle<TFields>[];

export interface TableColumnSingle<TFields> {
  accessorKey: TFields;
  header: string;
  keyValue?: KeyValueType;
  field?: Omit<FieldInterface, "label">;
}

// ===== tableFilters =====

export type TableFilterType = "text" | "select" | "date" | "number" | "boolean";

export interface TableFilterConfig {
  type: TableFilterType;
  label?: string;
  placeholder?: string;
  matchMode?: "like" | "equals" | "contains" | "startsWith" | "endsWith";
  options?: { label: string; value: string | number }[];
}

export type TableFiltersInterface<TFields extends string> = Partial<Record<TFields, TableFilterConfig>>;

// ===== formFields =====

export type FormFieldsInterface<TGroup extends string, TFields extends string> = {
  [K in TGroup]: {
    fields: Partial<Record<TFields, FieldInterface>>;
  };
};

export interface FieldInterface {
  type: "text" | "password" | "select" | "date";
  label: string;
  disabled?: boolean;
  options?: OptionType[];
}
