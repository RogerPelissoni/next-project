"use client";

import CoreCrudBuilderComponent from "@/core/components/CoreCrudBuilderComponent";
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { useCompanyResource } from "@/resources/company.resource";

export default function CompanyPage() {
  const rsCompany = useCompanyResource();

  return (
    <CoreTableProvider resource="company" columns={rsCompany.tableColumns} filterConfig={rsCompany.tableFilters}>
      <CoreFormProvider resource="company" title="Empresa" schema={rsCompany.schema} initialState={rsCompany.formStateInitial} formFields={rsCompany.formFields}>
        <CoreCrudBuilderComponent />
      </CoreFormProvider>
    </CoreTableProvider>
  );
}
