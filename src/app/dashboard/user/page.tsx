"use client";

import { API_ENDPOINTS } from "@/constants/api.constants";
import { RESOURCES } from "@/constants/resources.constants";
import CoreCrudBuilderComponent from "@/core/components/CoreCrudBuilderComponent";
import { CoreScreenWrapper } from "@/core/components/CoreScreenWrapper";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { useScreenData } from "@/core/hooks/useScreenData";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { useCoreTable } from "@/core/table/useCoreTable";
import { initUserResource } from "@/resources/user.resource";
import { UserPageContentProps, UserScreenData } from "@/types/user.types";
import { useEffect } from "react";

export default function UserPage() {
  const { data, loading, error } = useScreenData<UserScreenData>(API_ENDPOINTS.USER.SCREEN);

  return (
    <CoreScreenWrapper
      data={data}
      loading={loading}
      error={error}
      validateData={(data) => !!(data?.obUser && data?.kvProfile && data?.kvCompany && data?.kvPerson)}
    >
      {(screenData) => {
        const rsUser = initUserResource({
          kvProfile: screenData.kvProfile,
          kvCompany: screenData.kvCompany,
          kvPerson: screenData.kvPerson,
        });

        return (
          <CoreTableProvider
            resource={RESOURCES.USER.key}
            columns={rsUser.tableColumns}
            filterConfig={rsUser.tableFilters}
          >
            <UserPageContent rsUser={rsUser} obUser={screenData.obUser} />
          </CoreTableProvider>
        );
      }}
    </CoreScreenWrapper>
  );
}

function UserPageContent({ rsUser, obUser }: UserPageContentProps) {
  const coreTable = useCoreTable();

  useEffect(() => {
    coreTable.setData(obUser.data);
    coreTable.setTotalRecords(obUser.total);
  }, [obUser, coreTable]);

  return (
    <CoreFormProvider
      resource={RESOURCES.USER.key}
      title={RESOURCES.USER.title}
      schema={rsUser.schema}
      initialState={rsUser.formStateInitial}
      formFields={rsUser.formFields}
    >
      <CoreCrudBuilderComponent />
    </CoreFormProvider>
  );
}
