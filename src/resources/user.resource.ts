import { UserFormSchema, userSchema } from "@/schemas/user.schema";
import { FormFieldsInterface, TableColumnInterface, TableFiltersInterface } from "@/core/types/core.types";
import { KeyValueType, toOptions } from "@/core/utils/core.util";

interface ResourceParamsInterface {
  kvProfile: KeyValueType;
  kvCompany: KeyValueType;
  kvPerson: KeyValueType;
}

export const initUserResource = (params: ResourceParamsInterface) => {
  const opProfile = toOptions(params.kvProfile);
  const opCompany = toOptions(params.kvCompany);
  const opPerson = toOptions(params.kvPerson);

  const tableColumns: TableColumnInterface = [
    { accessorKey: "id", header: "#" },
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "person_id", header: "Pessoa", keyValue: params.kvPerson },
    { accessorKey: "profile_id", header: "Perfil", keyValue: params.kvProfile },
    { accessorKey: "company_id", header: "Empresa", keyValue: params.kvCompany },
  ];

  const tableFilters: TableFiltersInterface = {
    name: { type: "text", label: "Nome", matchMode: "like" },
    email: { type: "text", label: "Email", matchMode: "like" },
    profile_id: { type: "select", label: "Perfil", matchMode: "equals", options: opProfile },
    company_id: { type: "select", label: "Empresa", matchMode: "equals", options: opCompany },
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
        person_id: { type: "select", label: "Pessoa", options: opPerson },
        profile_id: { type: "select", label: "Perfil", options: opProfile },
        company_id: { type: "select", label: "Empresa", options: opCompany },
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
