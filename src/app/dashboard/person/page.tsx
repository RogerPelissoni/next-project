"use client";

import { Separator } from "@/components/ui/separator";
import { API_ENDPOINTS } from "@/constants/api.constants";
import { RESOURCES } from "@/constants/resources.constants";
import CoreCrudBuilderComponent from "@/core/components/CoreCrudBuilderComponent";
import { CoreScreenWrapper } from "@/core/components/CoreScreenWrapper";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { useScreenData } from "@/core/hooks/useScreenData";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { initPersonResource, PERSON_RESOURCE_QUERY } from "@/resources/person.resource";
import { PersonPageContentProps, PersonScreenData } from "@/types/person.types";
import { useMemo } from "react";

export default function PersonPage() {
  const { data, loading, error } = useScreenData<PersonScreenData>(API_ENDPOINTS.PERSON.SCREEN, {
    queryResources: PERSON_RESOURCE_QUERY,
  });

  return (
    <CoreScreenWrapper data={data} loading={loading} error={error} validateData={(data) => !!data?.obPerson}>
      {(screenData) => <PersonScreen screenData={screenData} />}
    </CoreScreenWrapper>
  );
}

export function PersonScreen({ screenData }: { screenData: PersonScreenData }) {
  const rsPerson = useMemo(() => initPersonResource(), []);

  return (
    <CoreTableProvider
      resource={RESOURCES.PERSON.key}
      queryResources={PERSON_RESOURCE_QUERY}
      columns={rsPerson.tableColumns}
      filterConfig={rsPerson.tableFilters}
      initialData={screenData.obPerson}
    >
      <PersonPageContent rsPerson={rsPerson} />
    </CoreTableProvider>
  );
}

export function PersonPageContent({ rsPerson }: PersonPageContentProps) {
  return (
    <CoreFormProvider
      resource={RESOURCES.PERSON.key}
      title={RESOURCES.PERSON.title}
      schema={rsPerson.schema}
      initialState={rsPerson.formStateInitial}
      formFields={rsPerson.formFields}
    >
      <CoreCrudBuilderComponent
        templateFormBottom={
          <>
            <Separator />
            <div className="w-full">
              <h2>Aqui vai a table detalhe do pessoaTelefone</h2>
            </div>
          </>
        }
      />
    </CoreFormProvider>
  );
}
