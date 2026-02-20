"use client";

import { Separator } from "@/components/ui/separator";
import { RESOURCES } from "@/constants/resources.constants";
import { useState } from "react";
import { useCoreForm } from "../form/CoreFormContext";
import { CoreFormProvider } from "../form/CoreFormProvider";
import { useSwalConfirm } from "../providers/ConfirmDialogProvider";
import { CoreTableComponent } from "../table/CoreTableComponent";
import { CoreTableProvider } from "../table/CoreTableProvider";
import CoreButtonComponent from "./CoreButtonComponent";
import CoreFormComponent from "./CoreFormComponent";
import CoreModalComponent from "./CoreModalComponent";

type Props = {
  rsConfig: any;
  rsKey: keyof typeof RESOURCES;
};

export default function CoreTableDetailComponent({ rsConfig, rsKey }: Props) {
  const coreForm = useCoreForm();

  // TODO: Implementar filtragem local, sem fetch

  return (
    <CoreTableProvider
      resource={RESOURCES[rsKey].key}
      columns={rsConfig.tableColumns}
      autoLoad={false}
      externalData={coreForm.formState[RESOURCES[rsKey].key]}
    >
      <CoreFormProvider
        resource={RESOURCES[rsKey].key}
        title={RESOURCES[rsKey].singular}
        schema={rsConfig.schema}
        initialState={rsConfig.formStateInitial}
        formFields={rsConfig.formFields}
      >
        <MainContent rsKey={rsKey} coreForm={coreForm} />
      </CoreFormProvider>
    </CoreTableProvider>
  );
}

function MainContent({ rsKey, coreForm }: { rsKey: keyof typeof RESOURCES; coreForm: any }) {
  const [openModal, setOpenModal] = useState(false);

  const keySubResource = RESOURCES[rsKey].key;
  const coreFormSub = useCoreForm();
  const swalConfirm = useSwalConfirm();

  function handleCreate() {
    coreFormSub.reset();
    setOpenModal(true);
  }

  function handleEdit(formState: any) {
    coreFormSub.setFormState(formState);
    setOpenModal(true);
  }

  async function handleDelete(_: any, rowIndex: number) {
    const confirmed = await swalConfirm({
      title: "Deseja remover o registro?",
      description: "Esta ação é irreversível.",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "destructive",
    });

    if (!confirmed) return;

    coreForm.setFormState((prev: any) => ({
      ...prev,
      [keySubResource]: prev[keySubResource].filter((_: any, i: number) => i !== rowIndex),
    }));
  }

  function onSubmit(formPayload: any) {
    const isUpdate = !!formPayload?.id;

    if (isUpdate) {
      coreForm.setFormState((prev: any) => ({
        ...prev,
        [keySubResource]: prev[keySubResource].map((item: any) => (item.id === formPayload.id ? formPayload : item)),
      }));
    } else {
      coreForm.setFormState((prev: any) => ({
        ...prev,
        [keySubResource]: [...(prev[keySubResource] ?? []), { id: `fake_${crypto.randomUUID()}`, ...formPayload }],
      }));
    }

    setOpenModal(false);
  }

  return (
    <>
      <Separator className="my-4" />

      <fieldset>
        <div className="flex justify-between items-center">
          <legend>{RESOURCES[rsKey].title}</legend>

          <CoreButtonComponent onClick={handleCreate}>Adicionar</CoreButtonComponent>
        </div>

        <CoreTableComponent onEdit={handleEdit} onDelete={handleDelete} />

        <CoreModalComponent
          open={openModal}
          onOpenChange={setOpenModal}
          title={`Adicionar ${RESOURCES[rsKey].singular}`}
        >
          <CoreFormComponent onSubmit={onSubmit} />
        </CoreModalComponent>
      </fieldset>
    </>
  );
}
