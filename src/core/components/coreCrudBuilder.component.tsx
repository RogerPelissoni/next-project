"use client";

import CoreCardComponent from "@/core/components/coreCard.component";
import CoreButtonComponent from "./coreButton.component";
import { useState } from "react";
import CoreFormComponent from "./coreForm.component";
import { ZodSchema } from "zod";
import { CoreTableComponent } from "@/core/table/CoreTableComponent";
import { http } from "../utils/http.util";
import { useCoreTable } from "../table/useCoreTable";
import { IconPlus, IconUndo } from "../utils/icon.util";

type CoreCrudBuilderProps = {
  resource: string;
  title: string;
  schema: ZodSchema<any>;
  formState: any;
  formFields: any;
};

export default function CoreCrudBuilderComponent({ resource, title, schema, formState, formFields }: CoreCrudBuilderProps) {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const toggleForm = () => setIsOpenForm(!isOpenForm);

  const coreTable = useCoreTable();

  const onSubmitForm = async (values: any) => {
    try {
      await http.post(resource, values);
      setIsOpenForm(false);
      coreTable.reload();

      // TODO: Enviar mensagem de sucesso (toast)
      console.log("Operação efetuada com sucesso!");
    } catch (error) {
      // TODO: Enviar mensagem de error (toast)
      // TODO: Efetuar padronização de erros
      console.log("Ocorreram problemas durante a operação!", error);
    }
  };

  return (
    <CoreCardComponent
      title={title}
      actions={
        <CoreButtonComponent onClick={toggleForm}>
          {isOpenForm ? (
            <>
              <IconUndo /> Voltar
            </>
          ) : (
            <>
              <IconPlus /> Novo Registro
            </>
          )}
        </CoreButtonComponent>
      }
      content={isOpenForm ? <CoreFormComponent schema={schema} formFields={formFields} defaultValues={formState} onSubmit={onSubmitForm} /> : <CoreTableComponent />}
    />
  );
}
