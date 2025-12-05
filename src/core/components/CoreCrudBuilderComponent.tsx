"use client";

import CoreCardComponent from "@/core/components/CoreCardComponent";
import CoreButtonComponent from "./CoreButtonComponent";
import { useState } from "react";
import CoreFormComponent from "./CoreFormComponent";
import { CoreTableComponent } from "@/core/table/CoreTableComponent";
import { http } from "../utils/http.util";
import { useCoreTable } from "../table/useCoreTable";
import { IconPlus, IconUndo } from "../utils/icon.util";
import { useCoreForm } from "../form/CoreFormContext";

export default function CoreCrudBuilderComponent() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const toggleForm = () => setIsOpenForm(!isOpenForm);

  const coreForm = useCoreForm();
  const coreTable = useCoreTable();

  const onSubmitForm = async (values: any) => {
    try {
      await http.post(coreForm.resource, values);
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

  const handleCreate = () => {
    coreForm.reset();
    toggleForm();
  };

  const handleEdit = (record: any) => {
    console.log("record", record);

    coreForm.setFormState(record);
    setIsOpenForm(true);
  };

  const handleDelete = async (record: any) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
      await http.delete(`${coreForm.resource}/${record.id}`);
      coreTable.reload();
      // toast.success("Registro excluído");
    } catch (error) {
      // toast.error("Erro ao excluir");
    }
  };

  return (
    <CoreCardComponent
      title={coreForm.title}
      actions={
        <CoreButtonComponent onClick={handleCreate}>
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
      content={isOpenForm ? <CoreFormComponent onSubmit={onSubmitForm} /> : <CoreTableComponent onEdit={handleEdit} onDelete={handleDelete} />}
    />
  );
}
