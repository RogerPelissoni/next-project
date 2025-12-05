import { UserFormSchema, userSchema } from "@/schemas/user.schema";
import { FormFieldsInterface, TableColumnInterface, TableFiltersInterface } from "@/core/types/core.types";
import { KeyValueType, toOptions } from "@/core/utils/core.util";
import { FormFieldsInjectorInterface, TableColumnsInjectorInterface } from "@/core/utils/injector.util";

export const tableColumns: TableColumnInterface = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "person_id", header: "Pessoa" },
  { accessorKey: "profile_id", header: "Perfil" },
  { accessorKey: "company_id", header: "Empresa" },
];

export const tableFilters: TableFiltersInterface = {
  name: { type: "text", label: "Nome", matchMode: "like" },
  email: { type: "text", label: "Email", matchMode: "like" },
  profile_id: { type: "select", label: "Perfil", matchMode: "equals" },
  company_id: { type: "select", label: "Empresa", matchMode: "equals" },
};

export const formStateInitial: UserFormSchema = {
  id: undefined,
  name: "",
  email: "",
  password: "",
  person_id: "",
  profile_id: "",
  company_id: "",
};

export const formFields: FormFieldsInterface<"main", UserFormSchema> = {
  main: {
    fields: {
      id: { type: "text", label: "ID", disabled: true },
      name: { type: "text", label: "Nome" },
      email: { type: "text", label: "Email" },
      password: { type: "password", label: "Senha" },
      person_id: { type: "select", label: "Pessoa" },
      profile_id: { type: "select", label: "Perfil" },
      company_id: { type: "select", label: "Empresa" },
    },
  },
};

export const injectors = {
  formFields: (kvProfile: KeyValueType, kvCompany: KeyValueType, kvPerson: KeyValueType): FormFieldsInjectorInterface => ({
    profile_id: { options: toOptions(kvProfile) },
    company_id: { options: toOptions(kvCompany) },
    person_id: { options: toOptions(kvPerson) },
  }),
  tableColumns: (kvProfile: KeyValueType, kvCompany: KeyValueType, kvPerson: KeyValueType): TableColumnsInjectorInterface => ({
    profile_id: { keyValue: kvProfile },
    company_id: { keyValue: kvCompany },
    person_id: { keyValue: kvPerson },
  }),
  tableFilters: (kvProfile: KeyValueType, kvCompany: KeyValueType, kvPerson: KeyValueType): FormFieldsInjectorInterface => ({
    profile_id: { options: toOptions(kvProfile) },
    company_id: { options: toOptions(kvCompany) },
    person_id: { options: toOptions(kvPerson) },
  }),
};

export const useUserResource = () => ({
  schema: userSchema,
  tableColumns,
  tableFilters,
  formStateInitial,
  formFields,
  injectors,
});
