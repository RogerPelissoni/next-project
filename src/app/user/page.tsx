"use client";

import { useEffect, useState } from "react";
import { useUserResource } from "@/resources/user.resource";
import CoreCrudBuilderComponent from "@/components/core/coreCrudBuilder.component";
import { useCoreTable } from "@/core/table/useCoreTable";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";

export default function UserPage() {
  const userResource = useUserResource();
  const [loaded, setLoaded] = useState(false);

  const [obProfile] = useState([{ id: "1", name: "Admin" }]);
  const [obCompany] = useState([{ id: "1", name: "Empresa X" }]);
  const [obPerson] = useState([{ id: "1", name: "João da Silva" }]);

  useEffect(() => {
    const injected = userResource.injectors.formFields(
      obProfile,
      obCompany,
      obPerson
    );

    Object.entries(injected).forEach(([key, value]) => {
      userResource.formFields.main.fields[key].options = value.options;
    });

    setLoaded(true);
  }, []);

  if (!loaded) return <div>Carregando...</div>;

  return (
    <CoreTableProvider resource="user" columns={userResource.tableColumns}>
      <UserPageContent />
    </CoreTableProvider>
  );
}

function UserPageContent() {
  const userResource = useUserResource();
  const coreTable = useCoreTable();

  console.log("coreTable", coreTable.columns, coreTable.data);

  return (
    <CoreCrudBuilderComponent
      title="Usuários"
      schema={userResource.schema}
      tableColumns={userResource.tableColumns}
      formState={userResource.formState}
      formFields={userResource.formFields}
    />
  );
}
