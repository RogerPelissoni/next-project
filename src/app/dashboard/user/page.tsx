"use client";

import { useEffect, useState } from "react";
import { useUserResource } from "@/resources/user.resource";
import CoreCrudBuilderComponent from "@/core/components/CoreCrudBuilderComponent";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { injectOnFilterFields, injectOnFormFields, injectOnTableColumns } from "@/core/utils/injector.util";
import { RetrieveMultiple } from "@/core/utils/retrieveMultiple.util";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";

export default function UserPage() {
  const userResource = useUserResource();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { kvProfile, kvCompany, kvPerson } = await RetrieveMultiple.get([
          { resource: "profile", keyValue: true, alias: "kvProfile" },
          { resource: "company", keyValue: true, alias: "kvCompany" },
          { resource: "person", keyValue: true, alias: "kvPerson" },
        ]);

        injectOnFormFields(userResource.formFields, userResource.injectors.formFields(kvProfile, kvCompany, kvPerson));
        injectOnTableColumns(userResource.tableColumns, userResource.injectors.tableColumns(kvProfile, kvCompany, kvPerson));
        injectOnFilterFields(userResource.tableFilters, userResource.injectors.tableFilters(kvProfile, kvCompany, kvPerson));
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
    <CoreTableProvider resource="user" columns={userResource.tableColumns} filterConfig={userResource.tableFilters}>
      <CoreFormProvider resource="user" title="Usuários" schema={userResource.schema} initialState={userResource.formStateInitial} formFields={userResource.formFields}>
        <CoreCrudBuilderComponent />
      </CoreFormProvider>
    </CoreTableProvider>
  );
}
