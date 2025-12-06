import { FormFieldsInterface, TableColumnInterface, TableFiltersInterface } from "@/core/types/core.types";
import { CompanyFormSchema, companySchema } from "@/schemas/company.schema";

export const tableColumns: TableColumnInterface = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "tp_company", header: "Tipo" },
  { accessorKey: "ds_email", header: "Email" },
  { accessorKey: "ds_phone", header: "Telefone" },
  { accessorKey: "ds_address", header: "Endereço" },
];

export const tableFilters: TableFiltersInterface = {
  name: { type: "text", label: "Nome", matchMode: "like" },
};

export const formStateInitial: CompanyFormSchema = {
  id: undefined,
  name: "",
  tp_company: "",
  ds_email: "",
  ds_phone: "",
  ds_address: "",
};

export const formFields: FormFieldsInterface<"main", CompanyFormSchema> = {
  main: {
    fields: {
      id: { type: "text", label: "ID", disabled: true },
      name: { type: "text", label: "Nome" },
      tp_company: { type: "select", label: "Tipo", options: [{ value: "1", label: "teste" }] },
      ds_email: { type: "text", label: "Email" },
      ds_phone: { type: "text", label: "Telefone" },
      ds_address: { type: "text", label: "Endereço" },
    },
  },
};

export const useCompanyResource = () => ({
  schema: companySchema,
  tableColumns,
  tableFilters,
  formStateInitial,
  formFields,
});
