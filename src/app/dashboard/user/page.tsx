"use client";

import { useEffect, useState } from "react";
import { initUserResource } from "@/resources/user.resource";
import CoreCrudBuilderComponent from "@/core/components/CoreCrudBuilderComponent";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { KeyValueType } from "@/core/utils/core.util";
import { http } from "@/core/utils/http.util";
import { useCoreTable } from "@/core/table/useCoreTable";
import { UserFormSchema } from "@/schemas/user.schema";
import { MainDataPayload } from "@/core/types/core.types";

type UserResourceType = ReturnType<typeof initUserResource>;

interface UserPageContentProps {
  rsUser: UserResourceType;
  obUser: MainDataPayload<UserFormSchema>;
}

export default function UserPage() {
  const [obUser, setObUser] = useState<MainDataPayload<UserFormSchema>>({ data: [], total: 0 });
  const [kvProfile, setKvProfile] = useState<KeyValueType>();
  const [kvCompany, setKvCompany] = useState<KeyValueType>();
  const [kvPerson, setKvPerson] = useState<KeyValueType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get("user/screen")
      .then(({ obUser, kvProfile, kvCompany, kvPerson }) => {
        setObUser(obUser);
        setKvProfile(kvProfile);
        setKvCompany(kvCompany);
        setKvPerson(kvPerson);
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
      <UserPageContent rsUser={rsUser} obUser={obUser} />
    </CoreTableProvider>
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
      resource="user"
      title="Usuários"
      schema={rsUser.schema}
      initialState={rsUser.formStateInitial}
      formFields={rsUser.formFields}
    >
      <CoreCrudBuilderComponent />
    </CoreFormProvider>
  );
}
