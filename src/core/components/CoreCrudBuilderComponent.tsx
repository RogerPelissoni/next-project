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
import { toast } from "../utils/toast.util";
import { useSwalConfirm } from "../providers/ConfirmDialogProvider";

export default function CoreCrudBuilderComponent() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const toggleForm = () => setIsOpenForm(!isOpenForm);

  const coreForm = useCoreForm();
  const coreTable = useCoreTable();

  const onSubmitForm = async (formValues: any) => {
    try {
      const isUpdateMethod = !!formValues.id;

      if (isUpdateMethod) {
        await http.patch(coreForm.resource, formValues);
      } else {
        await http.post(coreForm.resource, formValues);
      }

      setIsOpenForm(false);
      coreTable.reload();

      toast.success("Operação efetuada com sucesso!");
    } catch (error: any) {
      const errorMessage = error?.message;
      toast.success(`Ocorreram problemas durante a operação: ${errorMessage}`);
    }
  };

  const handleCreate = () => {
    coreForm.reset();
    toggleForm();
  };

  const handleEdit = (record: any) => {
    coreForm.setFormState(record);
    setIsOpenForm(true);
  };

  const swalConfirm = useSwalConfirm();

  const handleDelete = async (record: any) => {
    const confirmed = await swalConfirm({
      title: "Deseja remover o registro?",
      description: "Esta ação é irreversível.",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "destructive",
    });

    if (!confirmed) return;

    try {
      await http.delete(coreForm.resource, record);
      coreTable.reload();

      toast.success("Operação efetuada com sucesso!");
    } catch (error: any) {
      const errorMessage = error?.message;
      toast.error(`Ocorreram problemas durante a operação: ${errorMessage}`);
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
