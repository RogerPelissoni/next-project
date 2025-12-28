import { UserFormSchema, userSchema } from "@/schemas/user.schema";
import { FormFieldsInterface, TableColumnInterface, TableFiltersInterface } from "@/core/types/core.types";
import { KeyValueType, toOptions } from "@/core/utils/core.util";

interface ResourceOptionsInterface {
  kvProfile: KeyValueType;
  kvCompany: KeyValueType;
  kvPerson: KeyValueType;
}

export const initUserResource = (options: ResourceOptionsInterface) => {
  const tableColumns: TableColumnInterface = [
    { accessorKey: "id", header: "#" },
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "person_id", header: "Pessoa", keyValue: options.kvPerson },
    { accessorKey: "profile_id", header: "Perfil", keyValue: options.kvProfile },
    { accessorKey: "company_id", header: "Empresa", keyValue: options.kvCompany },
  ];

  const tableFilters: TableFiltersInterface = {
    name: { type: "text", label: "Nome", matchMode: "like" },
    email: { type: "text", label: "Email", matchMode: "like" },
    profile_id: { type: "select", label: "Perfil", matchMode: "equals", options: toOptions(options.kvProfile) },
    company_id: { type: "select", label: "Empresa", matchMode: "equals", options: toOptions(options.kvCompany) },
  };

  const formStateInitial: UserFormSchema = {
    id: undefined,
    name: "",
    email: "",
    password: "",
    person_id: "",
    profile_id: "",
    company_id: "",
  };

  const formFields: FormFieldsInterface<"main", UserFormSchema> = {
    main: {
      fields: {
        id: { type: "text", label: "ID", disabled: true },
        name: { type: "text", label: "Nome" },
        email: { type: "text", label: "Email" },
        password: { type: "password", label: "Senha" },
        person_id: { type: "select", label: "Pessoa", options: toOptions(options.kvPerson) },
        profile_id: { type: "select", label: "Perfil", options: toOptions(options.kvProfile) },
        company_id: { type: "select", label: "Empresa", options: toOptions(options.kvCompany) },
      },
    },
  };

  return {
    schema: userSchema,
    tableColumns,
    tableFilters,
    formStateInitial,
    formFields,
  };
};
