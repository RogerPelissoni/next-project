"use client";

import CoreCardComponent from "@/core/components/CoreCardComponent";
import CoreFormComponent from "@/core/components/CoreFormComponent";
import { CoreFormProvider } from "@/core/form/CoreFormProvider";
import { useLoginResource } from "@/resources/login.resource";
import { FieldValues } from "react-hook-form";

export default function LoginPage() {
  const rsLogin = useLoginResource();

  async function onSubmit(formData: FieldValues) {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      console.error(await res.json());
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <CoreCardComponent
        divClass="w-fit"
        title="Login"
        content={
          <CoreFormProvider resource="user" title="Usuários" schema={rsLogin.schema} initialState={rsLogin.formStateInitial} formFields={rsLogin.formFields}>
            <CoreFormComponent onSubmit={onSubmit} submitButtonText="Entrar" />
          </CoreFormProvider>
        }
      />
    </div>
  );
}
