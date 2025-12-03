import { UserFormSchema, userSchema } from "@/schemas/user.schema";
import { FormFieldsInterface, TableColumnInterface, TableFiltersInterface } from "@/types/core.types";
import { FormFieldsInjectorInterface } from "@/utils/injector.util";

export const tableColumns: TableColumnInterface = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "ds_person", header: "Pessoa" },
  { accessorKey: "ds_profile", header: "Perfil" },
  { accessorKey: "ds_company", header: "Empresa" },
];

export const tableFilters: TableFiltersInterface = {
  name: { 
    type: "text", 
    label: "Nome",
    placeholder: "Filtrar por nome",
    matchMode: "like" 
  },
  email: { 
    type: "text", 
    label: "Email",
    placeholder: "Filtrar por email",
    matchMode: "like" 
  },
  ds_profile: { 
    type: "select", 
    label: "Perfil",
    placeholder: "Selecionar perfil",
    matchMode: "equals"
  },
  ds_company: { 
    type: "select", 
    label: "Empresa",
    placeholder: "Selecionar empresa",
    matchMode: "equals"
  },
};

export const formState: UserFormSchema = {
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
  formFields: (obProfile: any[], obCompany: any[], obPerson: any[]): FormFieldsInjectorInterface => ({
    profile_id: {
      options: obProfile.map((p) => ({
        label: p.name ?? p.label,
        value: p.id ?? p.value,
      })),
    },
    company_id: {
      options: obCompany.map((c) => ({
        label: c.name ?? c.label,
        value: c.id ?? c.value,
      })),
    },
    person_id: {
      options: obPerson.map((p) => ({
        label: p.name ?? p.label,
        value: p.id ?? p.value,
      })),
    },
  }),
};

export const useUserResource = () => ({
  schema: userSchema,
  tableColumns,
  tableFilters,
  formState,
  formFields,
  injectors,
});
