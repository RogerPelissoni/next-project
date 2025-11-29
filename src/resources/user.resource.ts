import { UserFormSchema, userSchema } from "@/schemas/user.schema";

export interface CrudFieldConfig {
  type: "text" | "password" | "select";
  label: string;
  options?: { label: string; value: string }[];
}

export interface FormFieldsConfig {
  main: {
    fields: Record<keyof UserFormSchema, CrudFieldConfig>;
  };
}

export interface TableColumn {
  accessorKey: string;
  header: string;
}

export const tableColumns: TableColumn[] = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "ds_person", header: "Pessoa" },
  { accessorKey: "ds_profile", header: "Perfil" },
  { accessorKey: "ds_company", header: "Empresa" },
];

export const formState: UserFormSchema = {
  id: undefined,
  name: "",
  email: "",
  password: "",
  person_id: "",
  profile_id: "",
  company_id: "",
};

export const formFields: FormFieldsConfig = {
  main: {
    fields: {
      name: { type: "text", label: "Nome" },
      email: { type: "text", label: "Email" },
      password: { type: "password", label: "Senha" },
      person_id: { type: "select", label: "Pessoa" },
      profile_id: { type: "select", label: "Perfil" },
      company_id: { type: "select", label: "Empresa" },
      id: { type: "text", label: "ID" }, // normalmente hidden, mas coloquei para manter a interface completa
    },
  },
};

export const injectors = {
  formFields: (obProfile: any[], obCompany: any[], obPerson: any[]) => ({
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
  formState,
  formFields,
  injectors,
});
