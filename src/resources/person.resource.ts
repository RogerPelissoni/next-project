import { toOptions } from "@/core/utils/core.util";
import {
  FormFieldsInterface,
  QueryFields,
  TableColumnInterface,
  TableFiltersInterface,
} from "@/core/utils/resource.util";
import { PersonGenderEnum } from "@/enums/personGender.enum";
import { makePersonQueryResources, PersonFormSchema, personSchema } from "@/schemas/person.schema";

export const PERSON_RESOURCE_QUERY = makePersonQueryResources({
  fields: [
    "id",
    "name",
    "ds_document",
    "ds_email",
    "ds_phone",
    "da_birth",
    "tp_gender",
    "ds_address_street",
    "ds_address_number",
    "ds_address_complement",
    "ds_address_district",
    "ds_address_city",
    "ds_address_state",
    "ds_address_zipcode",
    "fl_active",
  ],
  appends: [],
  hydrators: [],
});

export const initPersonResource = () => {
  type PersonQueryFields = QueryFields<typeof PERSON_RESOURCE_QUERY>;

  const tableColumns: TableColumnInterface<PersonQueryFields> = [
    { accessorKey: "id", header: "#" },
    { accessorKey: "name", header: "Nome", field: { type: "text" } },
    { accessorKey: "ds_document", header: "Documento" },
    { accessorKey: "ds_email", header: "Email" },
    { accessorKey: "ds_phone", header: "Telefone" },
    { accessorKey: "da_birth", header: "Data de Nascimento" },
    { accessorKey: "tp_gender", header: "Gênero", keyValue: PersonGenderEnum },
    { accessorKey: "ds_address_street", header: "Rua" },
    { accessorKey: "ds_address_number", header: "Número" },
    { accessorKey: "ds_address_complement", header: "Complemento" },
    { accessorKey: "ds_address_district", header: "Bairro" },
    { accessorKey: "ds_address_city", header: "Cidade" },
    { accessorKey: "ds_address_state", header: "Estado" },
    { accessorKey: "ds_address_zipcode", header: "CEP" },
    { accessorKey: "fl_active", header: "Ativo" },
  ];

  const tableFilters: TableFiltersInterface<PersonQueryFields> = {
    name: { type: "text", label: "Nome", matchMode: "like" },
    ds_document: { type: "text", label: "Documento", matchMode: "like" },
    ds_email: { type: "text", label: "Email", matchMode: "like" },
    tp_gender: { type: "select", label: "Gênero", matchMode: "equals" },
    ds_address_city: { type: "text", label: "Cidade", matchMode: "like" },
    ds_address_state: { type: "text", label: "Estado", matchMode: "equals" },
    fl_active: { type: "select", label: "Ativo", matchMode: "equals" },
  };

  const formStateInitial: Pick<PersonFormSchema, PersonQueryFields> = {
    id: undefined,
    name: "",
    ds_document: "",
    ds_email: "",
    ds_phone: "",
    da_birth: "",
    tp_gender: undefined,
    ds_address_street: "",
    ds_address_number: "",
    ds_address_complement: "",
    ds_address_district: "",
    ds_address_city: "",
    ds_address_state: "",
    ds_address_zipcode: "",
    fl_active: true,
  };

  const formFields: FormFieldsInterface<"main", PersonQueryFields> = {
    main: {
      fields: {
        id: { type: "text", label: "ID", disabled: true },
        name: { type: "text", label: "Nome" },
        ds_document: { type: "text", label: "Documento" },
        ds_email: { type: "text", label: "Email" },
        ds_phone: { type: "text", label: "Telefone" },
        da_birth: { type: "date", label: "Data de Nascimento" },
        tp_gender: { type: "select", label: "Gênero", options: toOptions(PersonGenderEnum) },
        ds_address_street: { type: "text", label: "Rua" },
        ds_address_number: { type: "text", label: "Número" },
        ds_address_complement: { type: "text", label: "Complemento" },
        ds_address_district: { type: "text", label: "Bairro" },
        ds_address_city: { type: "text", label: "Cidade" },
        ds_address_state: { type: "text", label: "Estado" },
        ds_address_zipcode: { type: "text", label: "CEP" },
        fl_active: { type: "select", label: "Ativo" },
      },
    },
  };

  return {
    schema: personSchema,
    tableColumns,
    tableFilters,
    formStateInitial,
    formFields,
  };
};
