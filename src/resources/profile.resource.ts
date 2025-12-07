import { FormFieldsInterface, TableColumnInterface, TableFiltersInterface } from "@/core/types/core.types";
import { KeyValueType, toOptions } from "@/core/utils/core.util";
import { FormFieldsInjectorInterface, TableColumnsInjectorInterface } from "@/core/utils/injector.util";
import { ProfileFormSchema, profileSchema } from "@/schemas/profile.schema";

export const tableColumns: TableColumnInterface = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "ds_description", header: "Descrição" },
  { accessorKey: "company_id", header: "Empresa" },
];

export const tableFilters: TableFiltersInterface = {
  name: { type: "text", label: "Nome", matchMode: "like" },
};

export const formStateInitial: ProfileFormSchema = {
  id: undefined,
  name: "",
  ds_description: "",
  company_id: "",
};

export const formFields: FormFieldsInterface<"main", ProfileFormSchema> = {
  main: {
    fields: {
      id: { type: "text", label: "ID", disabled: true },
      name: { type: "text", label: "Nome" },
      ds_description: { type: "text", label: "Descrição" },
      company_id: { type: "select", label: "Empresa" },
    },
  },
};

export const injectors = {
  formFields: (kvCompany: KeyValueType): FormFieldsInjectorInterface => ({
    company_id: { options: toOptions(kvCompany) },
  }),
  tableColumns: (kvCompany: KeyValueType): TableColumnsInjectorInterface => ({
    company_id: { keyValue: kvCompany },
  }),
};

export const useProfileResource = () => ({
  schema: profileSchema,
  tableColumns,
  tableFilters,
  formStateInitial,
  formFields,
  injectors,
});
