"use client";

import CoreCardComponent from "@/core/components/CoreCardComponent";
import CoreFormComponent from "@/core/components/CoreFormComponent";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { useLoginResource } from "@/resources/login.resource";

export default function LoginPage() {
  const rsLogin = useLoginResource();

  return (
    <CoreCardComponent
      title="Login"
      content={
        <CoreFormProvider resource="user" title="Usuários" schema={rsLogin.schema} initialState={rsLogin.formStateInitial} formFields={rsLogin.formFields}>
          <CoreFormComponent
            onSubmit={async (formData) => {
              const res = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify(formData),
              });

              if (!res.ok) {
                console.error(await res.json());
                return;
              }

              window.location.href = "/dashboard";
            }}
          />
        </CoreFormProvider>
      }
    />
  );
}
