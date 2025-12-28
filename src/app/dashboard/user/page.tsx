"use client";

import { useEffect, useState } from "react";
import { initUserResource } from "@/resources/user.resource";
import CoreCrudBuilderComponent from "@/core/components/CoreCrudBuilderComponent";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { RetrieveMultiple } from "@/core/utils/retrieveMultiple.util";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { KeyValueType } from "@/core/utils/core.util";

export default function UserPage() {
  const [kvProfile, setKvProfile] = useState<KeyValueType>();
  const [kvCompany, setKvCompany] = useState<KeyValueType>();
  const [kvPerson, setKvPerson] = useState<KeyValueType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    RetrieveMultiple.get([
      { resource: "profile", keyValue: true, alias: "kvProfile" },
      { resource: "company", keyValue: true, alias: "kvCompany" },
      { resource: "person", keyValue: true, alias: "kvPerson" },
    ])
      .then((res) => {
        setKvProfile(res.kvProfile);
        setKvCompany(res.kvCompany);
        setKvPerson(res.kvPerson);
      })
      .catch((error) => console.error("Erro ao buscar resources:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !kvProfile || !kvCompany || !kvPerson) {
    return <div>Carregando...</div>;
  }

  const rsUser = initUserResource({ kvProfile, kvCompany, kvPerson });

  return (
    <CoreTableProvider resource="user" columns={rsUser.tableColumns} filterConfig={rsUser.tableFilters}>
      <CoreFormProvider resource="user" title="Usuários" schema={rsUser.schema} initialState={rsUser.formStateInitial} formFields={rsUser.formFields}>
        <CoreCrudBuilderComponent />
      </CoreFormProvider>
    </CoreTableProvider>
  );
}
