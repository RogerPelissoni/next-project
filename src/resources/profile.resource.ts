import { FormFieldsInterface, TableColumnInterface, TableFiltersInterface } from "@/core/types/core.types";
import { KeyValueType, toOptions } from "@/core/utils/core.util";
import { ProfileFormSchema, profileSchema } from "@/schemas/profile.schema";

interface ResourceOptionsInterface {
  kvCompany: KeyValueType;
}

export const initProfileResource = (options: ResourceOptionsInterface) => {
  const tableColumns: TableColumnInterface = [
    { accessorKey: "id", header: "#" },
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "ds_description", header: "Descrição" },
    { accessorKey: "company_id", header: "Empresa", keyValue: options.kvCompany },
  ];

  const tableFilters: TableFiltersInterface = {
    name: { type: "text", label: "Nome", matchMode: "like" },
  };

  const formStateInitial: ProfileFormSchema = {
    id: undefined,
    name: "",
    ds_description: "",
    company_id: "",
  };

  const formFields: FormFieldsInterface<"main", ProfileFormSchema> = {
    main: {
      fields: {
        id: { type: "text", label: "ID", disabled: true },
        name: { type: "text", label: "Nome" },
        ds_description: { type: "text", label: "Descrição" },
        company_id: { type: "select", label: "Empresa", options: toOptions(options.kvCompany) },
      },
    },
  };

  return {
    schema: profileSchema,
    tableColumns,
    tableFilters,
    formStateInitial,
    formFields,
  };
};
