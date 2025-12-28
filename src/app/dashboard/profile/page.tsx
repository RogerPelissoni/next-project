"use client";

import CoreCrudBuilderComponent from "@/core/components/CoreCrudBuilderComponent";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { initProfileResource } from "@/resources/profile.resource";
import { useEffect, useState } from "react";
import { RetrieveMultiple } from "@/core/utils/retrieveMultiple.util";
import { http } from "@/core/utils/http.util";
import { CoreUncoupledSelect } from "@/core/components/CoreUncoupledSelectComponent";
import { KeyValueType } from "@/core/utils/core.util";

interface ProfilePermissionInterface {
  profile_permission_id: number | undefined;
  permission_level: number;
  resource_id: string | number;
  ds_resource: string;
}

export default function ProfilePage() {
  const [kvCompany, setKvCompany] = useState<KeyValueType>();
  const [loading, setLoading] = useState(false);
  const [obProfilePermissions, setObProfilePermissions] = useState<ProfilePermissionInterface[]>([]);

  async function onEnterCreate() {
    setObProfilePermissions(await http.get(`profile/99999999999`));
  }

  async function onEnterUpdate(formState: any) {
    const idProfile = formState.id;
    setObProfilePermissions(await http.get(`profile/${idProfile}`));
  }

  function fnBeforeSubmitForm(formState: any) {
    formState.profilePermission = obProfilePermissions;
  }

  useEffect(() => {
    RetrieveMultiple.get([{ resource: "company", keyValue: true, alias: "kvCompany" }])
      .then((res) => {
        setKvCompany(res.kvCompany);
      })
      .catch((error) => console.error("Erro ao buscar resources: ", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !kvCompany) {
    return <div>Carregando...</div>;
  }

  const rsProfile = initProfileResource({ kvCompany });

  return (
    <CoreTableProvider resource="profile" columns={rsProfile.tableColumns} filterConfig={rsProfile.tableFilters}>
      <CoreFormProvider resource="profile" title="Perfis" schema={rsProfile.schema} initialState={rsProfile.formStateInitial} formFields={rsProfile.formFields}>
        <CoreCrudBuilderComponent
          onEnterCreate={onEnterCreate}
          onEnterUpdate={onEnterUpdate}
          fnBeforeSubmitForm={fnBeforeSubmitForm}
          templateFormBottom={TemplateProfilePermission(obProfilePermissions, setObProfilePermissions)}
        />
      </CoreFormProvider>
    </CoreTableProvider>
  );
}

function TemplateProfilePermission(obProfilePermissions: ProfilePermissionInterface[], setObProfilePermissions: React.Dispatch<React.SetStateAction<ProfilePermissionInterface[]>>) {
  const optPermissionLevel = [
    { value: "0", label: "0 - Sem Acesso" },
    { value: "1", label: "1 - Apenas Visualização" },
    { value: "2", label: "2 - Criação e Edição" },
    { value: "3", label: "3 - Exclusão" },
    { value: "4", label: "4 - Acesso Total" },
  ];

  return (
    <div className="w-full">
      <table>
        <thead>
          <tr>
            <th>Recurso</th>
            <th>Nível de Permissão</th>
          </tr>
        </thead>
        <tbody>
          {obProfilePermissions.map((item, key) => (
            <tr key={key}>
              <td>{item.ds_resource}</td>
              <td>
                <CoreUncoupledSelect
                  value={String(item.permission_level)}
                  onChange={(v) => setObProfilePermissions((prev) => prev.map((row) => (row.resource_id === item.resource_id ? { ...row, permission_level: Number(v) } : row)))}
                  options={optPermissionLevel}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
