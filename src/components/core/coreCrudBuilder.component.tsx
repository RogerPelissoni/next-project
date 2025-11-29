"use client";

import CoreCardComponent from "@/components/core/coreCard.component";
import CoreButtonComponent from "./coreButton.component";
import { useState } from "react";
import CoreFormComponent from "./coreForm.component";
import { ZodSchema } from "zod";
import { CoreTableComponent } from "@/core/table/CoreTableComponent";

type CoreCrudBuilderProps = {
  title: string;
  schema: ZodSchema<any>;
  tableColumns: any[];
  formState: any;
  formFields: any;
};

export default function CoreCrudBuilderComponent({
  title,
  schema,
  tableColumns,
  formState,
  formFields,
}: CoreCrudBuilderProps) {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const toggleForm = () => setIsOpenForm(!isOpenForm);

  return (
    <CoreCardComponent
      title={title}
      actions={
        <CoreButtonComponent
          label={isOpenForm ? "Voltar" : "Novo Registro"}
          onClick={toggleForm}
        />
      }
      content={
        isOpenForm ? (
          <CoreFormComponent
            schema={schema}
            formFields={formFields}
            defaultValues={formState}
            onSubmit={async (values) => {
              // await api.createUser(values);
              // atualizar lista, fechar modal, etc.
            }}
          />
        ) : (
          <CoreTableComponent />
        )
      }
    />
  );
}
