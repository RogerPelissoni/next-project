"use client";

import { Separator } from "@/components/ui/separator";
import { RESOURCES } from "@/constants/resources.constants";
import { useState } from "react";
import { useCoreForm } from "../form/CoreFormContext";
import { CoreFormProvider } from "../form/CoreFormProvider";
import { useSwalConfirm } from "../providers/ConfirmDialogProvider";
import { CoreTableComponent } from "../table/CoreTableComponent";
import { CoreTableProvider } from "../table/CoreTableProvider";
import { useCoreTable } from "../table/useCoreTable";
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
      initialData={{
        data: coreForm.formState.person_phone ?? [],
        total: coreForm.formState.person_phone?.length,
      }}
    >
      <CoreFormProvider
        resource={RESOURCES[rsKey].key}
        title={RESOURCES[rsKey].singular}
        schema={rsConfig.schema}
        initialState={rsConfig.formStateInitial}
        formFields={rsConfig.formFields}
      >
        <MainContent rsKey={rsKey} />
      </CoreFormProvider>
    </CoreTableProvider>
  );
}

function MainContent({ rsKey }: { rsKey: keyof typeof RESOURCES }) {
  const [openModal, setOpenModal] = useState(false);

  const keySubResource = RESOURCES[rsKey].key;
  const coreTableSub = useCoreTable();
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

  async function handleDelete(formState: any, rowIndex: number) {
    const confirmed = await swalConfirm({
      title: "Deseja remover o registro?",
      description: "Esta ação é irreversível.",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "destructive",
    });

    if (!confirmed) return;

    coreTableSub.setData(coreTableSub.data.filter((v, i) => i !== rowIndex));
  }

  function onSubmit(formPayload: any) {
    const isUpdate = !!formPayload?.id;
    const currentData = coreTableSub.data;

    if (isUpdate) {
      const newData = currentData.map((item) => (item.id === formPayload.id ? formPayload : item));

      coreTableSub.setData([...newData]);
      coreTableSub.setTotalRecords(newData.length);
    } else {
      const newRegister = {
        id: `fake_${crypto.randomUUID()}`,
        ...formPayload,
      };

      coreFormSub.setFormState((prev: any) => ({
        ...prev,
        [keySubResource]: [...(prev[keySubResource] ?? []), newRegister],
      }));

      coreTableSub.setData([...currentData, newRegister]);
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
