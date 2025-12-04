"use client";

import CoreCardComponent from "@/core/components/coreCard.component";
import CoreFormComponent from "@/core/components/coreForm.component";
import { useLoginResource } from "@/resources/login.resource";

export default function LoginPage() {
  const rsLogin = useLoginResource();

  return (
    <CoreCardComponent
      title="Login"
      content={
        <CoreFormComponent
          schema={rsLogin.schema}
          formFields={rsLogin.formFields}
          defaultValues={rsLogin.formState}
          onSubmit={async (formData) => {
            const res = await fetch("/api/login", {
              method: "POST",
              body: JSON.stringify(formData),
            });

            if (!res.ok) {
              console.error(await res.json());
              return;
            }

            // TODO: Implementar swal e toast (buscar mais utilizado para NextJS)
            console.log("Logado com sucesso!");
          }}
        />
      }
    />
  );
}
