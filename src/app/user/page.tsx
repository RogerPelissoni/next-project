"use client";

import { useEffect, useState } from "react";
import { useUserResource } from "@/resources/user.resource";
import CoreCrudBuilderComponent from "@/components/core/coreCrudBuilder.component";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { injectOnFormFields } from "@/utils/injector.util";
import { RetrieveMultiple } from "@/utils/retrieveMultiple.util";

// Não remover, exemplo de utilização de contexto na página
// import { useCoreTable } from "@/core/table/useCoreTable";

export default function UserPage() {
  const userResource = useUserResource();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const result = await RetrieveMultiple.get([
          { resource: "profile", keyValue: true, alias: "kvProfile" },
          { resource: "company", keyValue: true, alias: "kvCompany" },
          { resource: "person", keyValue: true, alias: "kvPerson" },
        ]);

        injectOnFormFields(userResource.formFields, userResource.injectors.formFields(result.kvProfile, result.kvCompany, result.kvPerson));
      } catch (error) {
        console.error("Erro ao buscar resources:", error);
      } finally {
        Promise.resolve().then(() => setLoaded(true));
      }
    };

    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) return <div>Carregando...</div>;

  return (
    <CoreTableProvider resource="user" columns={userResource.tableColumns} filterConfig={userResource.tableFilters}>
      <UserPageContent />
    </CoreTableProvider>
  );
}

function UserPageContent() {
  const userResource = useUserResource();

  // Não remover, exemplo de utilização de contexto na página
  // const coreTable = useCoreTable();
  // console.log("coreTable", coreTable.columns, coreTable.data);

  return <CoreCrudBuilderComponent title="Usuários" schema={userResource.schema} formState={userResource.formState} formFields={userResource.formFields} />;
}
