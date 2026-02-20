"use client";

import { API_ENDPOINTS } from "@/constants/api.constants";
import { RESOURCES } from "@/constants/resources.constants";
import CoreCrudBuilderComponent from "@/core/components/CoreCrudBuilderComponent";
import { CoreScreenWrapper } from "@/core/components/CoreScreenWrapper";
import CoreTableDetailComponent from "@/core/components/CoreTableDetailComponent";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { useScreenData } from "@/core/hooks/useScreenData";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { initPersonResource, PERSON_RESOURCE_QUERY } from "@/resources/person.resource";
import { initPersonPhoneResource } from "@/resources/personPhone.resource";
import { PersonScreenData } from "@/types/person.types";
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

function PersonScreen({ screenData }: { screenData: PersonScreenData }) {
  const rsPerson = useMemo(() => initPersonResource(), []);
  const rsPersonPhone = useMemo(() => initPersonPhoneResource(), []);

  return (
    <CoreTableProvider
      resource={RESOURCES.PERSON.key}
      queryResources={PERSON_RESOURCE_QUERY}
      columns={rsPerson.tableColumns}
      filterConfig={rsPerson.tableFilters}
      initialData={screenData.obPerson}
    >
      <CoreFormProvider
        resource={RESOURCES.PERSON.key}
        title={RESOURCES.PERSON.title}
        schema={rsPerson.schema}
        initialState={rsPerson.formStateInitial}
        formFields={rsPerson.formFields}
      >
        <CoreCrudBuilderComponent
          templateFormBottom={<CoreTableDetailComponent rsConfig={rsPersonPhone} rsKey="PERSON_PHONE" />}
        />
      </CoreFormProvider>
    </CoreTableProvider>
  );
}
