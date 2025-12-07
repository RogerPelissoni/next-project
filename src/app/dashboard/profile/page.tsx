"use client";

import CoreCrudBuilderComponent from "@/core/components/CoreCrudBuilderComponent";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { useProfileResource } from "@/resources/profile.resource";
import { useEffect, useState } from "react";
import { RetrieveMultiple } from "@/core/utils/retrieveMultiple.util";
import { injectOnFormFields, injectOnTableColumns } from "@/core/utils/injector.util";

export default function ProfilePage() {
  const rsProfile = useProfileResource();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { kvCompany } = await RetrieveMultiple.get([{ resource: "company", keyValue: true, alias: "kvCompany" }]);

        injectOnFormFields(rsProfile.formFields, rsProfile.injectors.formFields(kvCompany));
        injectOnTableColumns(rsProfile.tableColumns, rsProfile.injectors.tableColumns(kvCompany));
      } catch (error) {
        console.error("Erro ao buscar resources:", error);
      } finally {
        setLoaded(true);
      }
    };

    fetchResources();
  }, []);

  if (!loaded) return <div>Carregando...</div>;

  return (
    <CoreTableProvider resource="profile" columns={rsProfile.tableColumns} filterConfig={rsProfile.tableFilters}>
      <CoreFormProvider resource="profile" title="Perfis" schema={rsProfile.schema} initialState={rsProfile.formStateInitial} formFields={rsProfile.formFields}>
        <CoreCrudBuilderComponent />
      </CoreFormProvider>
    </CoreTableProvider>
  );
}
