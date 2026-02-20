"use client";

import { ReactNode, useState } from "react";
import { FormFieldsInterface } from "../utils/resource.util";
import { CoreFormContext, type CoreFormContextType } from "./CoreFormContext";

interface Props<T extends Record<string, any>> {
  children: ReactNode;
  initialState: T;
  formFields: FormFieldsInterface<any, any>;
  schema: any;
  resource: string;
  title: string;
}

export function CoreFormProvider<T extends Record<string, any>>({
  children,
  initialState,
  formFields,
  schema,
  resource,
  title,
}: Props<T>) {
  const [formState, setFormState] = useState<T>(initialState);

  const setForm = (value: Partial<T> | ((prev: T) => T)) => {
    setFormState((prev) => {
      if (typeof value === "function") return value(prev);
      return { ...prev, ...value };
    });
  };

  const setField = (key: keyof T, value: any) => {
    setForm({ [key]: value } as Partial<T>);
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  const value: CoreFormContextType<T> = {
    formState,
    setFormState: setForm,
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
