"use client";

import { API_ENDPOINTS } from "@/constants/api.constants";
import { RESOURCES } from "@/constants/resources.constants";
import CoreCrudBuilderComponent from "@/core/components/CoreCrudBuilderComponent";
import { CoreScreenWrapper } from "@/core/components/CoreScreenWrapper";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { useScreenData } from "@/core/hooks/useScreenData";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { useCoreTable } from "@/core/table/useCoreTable";
import { initPersonResource } from "@/resources/person.resource";
import { PersonPageContentProps, PersonScreenData } from "@/types/person.types";
import { useEffect } from "react";

export default function PersonPage() {
  const { data, loading, error } = useScreenData<PersonScreenData>(API_ENDPOINTS.PERSON.SCREEN);

  return (
    <CoreScreenWrapper data={data} loading={loading} error={error} validateData={(data) => !!data?.obPerson}>
      {(screenData) => {
        const rsPerson = initPersonResource();

        return (
          <CoreTableProvider
            resource={RESOURCES.PERSON.key}
            columns={rsPerson.tableColumns}
            filterConfig={rsPerson.tableFilters}
          >
            <PersonPageContent rsPerson={rsPerson} obPerson={screenData.obPerson} />
          </CoreTableProvider>
        );
      }}
    </CoreScreenWrapper>
  );
}

function PersonPageContent({ rsPerson, obPerson }: PersonPageContentProps) {
  const coreTable = useCoreTable();

  useEffect(() => {
    coreTable.setData(obPerson.data);
    coreTable.setTotalRecords(obPerson.total);
  }, []);

  return (
    <CoreFormProvider
      resource={RESOURCES.PERSON.key}
      title={RESOURCES.PERSON.title}
      schema={rsPerson.schema}
      initialState={rsPerson.formStateInitial}
      formFields={rsPerson.formFields}
    >
      <CoreCrudBuilderComponent />
    </CoreFormProvider>
  );
}
