"use client";

import CoreCardComponent from "@/core/components/CoreCardComponent";
import { CoreTableComponent } from "@/core/table/CoreTableComponent";
import { useState } from "react";
import { useCoreForm } from "../form/CoreFormContext";
import { useSwalConfirm } from "../providers/ConfirmDialogProvider";
import { useCoreTable } from "../table/useCoreTable";
import { http } from "../utils/http.util";
import { IconPlus, IconUndo } from "../utils/icon.util";
import { toast } from "../utils/toast.util";
import CoreButtonComponent from "./CoreButtonComponent";
import CoreFormComponent from "./CoreFormComponent";

interface Props {
  onEnterCreate?: () => void;
  onEnterUpdate?: (formState: any) => void;
  fnBeforeSubmitForm?: (formState: any) => void;
  templateFormBottom?: React.ReactNode;
}

export default function CoreCrudBuilderComponent({
  onEnterCreate,
  onEnterUpdate,
  fnBeforeSubmitForm,
  templateFormBottom,
}: Props) {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const toggleForm = () => setIsOpenForm(!isOpenForm);

  const coreForm = useCoreForm();
  const coreTable = useCoreTable();

  const onSubmitForm = async (formState: any) => {
    try {
      const isUpdateMethod = !!formState.id;

      if (fnBeforeSubmitForm) fnBeforeSubmitForm(formState);

      if (isUpdateMethod) {
        await http.patch(coreForm.resource, formState);
      } else {
        await http.post(coreForm.resource, formState);
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
    if (onEnterCreate) onEnterCreate();
    toggleForm();
  };

  const handleEdit = (formState: any) => {
    coreForm.setFormState(formState);
    if (onEnterUpdate) onEnterUpdate(formState);
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
      content={
        isOpenForm ? (
          <CoreFormComponent onSubmit={onSubmitForm} templateBottom={templateFormBottom} />
        ) : (
          <CoreTableComponent onEdit={handleEdit} onDelete={handleDelete} />
        )
      }
    />
  );
}
