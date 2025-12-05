import { LoginFormSchema, loginSchema } from "@/schemas/login.schema";
import { FormFieldsInterface } from "@/core/types/core.types";

export const formStateInitial: LoginFormSchema = {
  email: "",
  password: "",
};

export const formFields: FormFieldsInterface<"main", LoginFormSchema> = {
  main: {
    fields: {
      email: { type: "text", label: "Email" },
      password: { type: "password", label: "Senha" },
    },
  },
};

export const useLoginResource = () => ({
  schema: loginSchema,
  formStateInitial,
  formFields,
});
