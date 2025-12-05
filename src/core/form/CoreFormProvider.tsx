"use client";

import { ReactNode, useState } from "react";
import { CoreFormContext, type CoreFormContextType } from "./CoreFormContext";
import { FormFieldsInterface } from "../types/core.types";

interface Props<T extends Record<string, any>> {
  children: ReactNode;
  initialState: T;
  formFields: FormFieldsInterface<any, T>;
  schema: any;
  resource: string;
  title: string;
}

export function CoreFormProvider<T extends Record<string, any>>({ children, initialState, formFields, schema, resource, title }: Props<T>) {
  const [formState, setFormState] = useState<T>(initialState);

  const updateForm = (data: Partial<T>) => {
    setFormState((prev) => ({ ...prev, ...data }));
  };

  const setField = (key: keyof T, value: any) => {
    updateForm({ [key]: value } as Partial<T>);
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  const value: CoreFormContextType<T> = {
    formState,
    setFormState: updateForm,
    setField,
    reset: resetForm,
    formFields,
    schema,
    resource,
    title,
    initialState,
  };

  return <CoreFormContext.Provider value={value}>{children}</CoreFormContext.Provider>;
}
