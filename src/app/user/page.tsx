"use client";

import { useEffect, useState } from "react";
import { useUserResource } from "@/resources/user.resource";
import CoreCrudBuilderComponent from "@/components/core/coreCrudBuilder.component";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { injectOnFormFields } from "@/utils/injector.util";

// Não remover, exemplo de utilização de contexto na página
// import { useCoreTable } from "@/core/table/useCoreTable";

export default function UserPage() {
  const userResource = useUserResource();
  const [loaded, setLoaded] = useState(false);

  const [obProfile] = useState([{ id: "1", name: "Admin" }]);
  const [obCompany] = useState([
    { id: "1", name: "Empresa X" },
    { id: "2", name: "Empresa Y" },
  ]);
  const [obPerson] = useState([{ id: "1", name: "João da Silva" }]);

  useEffect(() => {
    injectOnFormFields(
      userResource.formFields,
      userResource.injectors.formFields(obProfile, obCompany, obPerson)
    );

    Promise.resolve().then(() => setLoaded(true));
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

  return (
    <CoreCrudBuilderComponent
      title="Usuários"
      schema={userResource.schema}
      formState={userResource.formState}
      formFields={userResource.formFields}
    />
  );
}
