import { FormFieldsInterface, TableColumnInterface, TableFiltersInterface } from "@/core/utils/resource.util";
import { PersonPhoneFormSchema, personPhoneSchema } from "@/schemas/person.schema";

export const initPersonPhoneResource = () => {
  type PersonPhoneQueryFields = keyof PersonPhoneFormSchema;

  const tableColumns: TableColumnInterface<PersonPhoneQueryFields> = [{ accessorKey: "ds_phone", header: "Telefone" }];

  const tableFilters: TableFiltersInterface<PersonPhoneQueryFields> = {
    ds_phone: { type: "text", label: "Telefone", matchMode: "like" },
  };

  const formStateInitial: Pick<PersonPhoneFormSchema, PersonPhoneQueryFields> = {
    ds_phone: "",
  };

  const formFields: FormFieldsInterface<"main", PersonPhoneQueryFields> = {
    main: {
      fields: {
        ds_phone: { type: "text", label: "Telefone" },
      },
    },
  };

  return {
    schema: personPhoneSchema,
    tableColumns,
    tableFilters,
    formStateInitial,
    formFields,
  };
};
