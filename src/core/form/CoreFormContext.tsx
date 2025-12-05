"use client";

import { createContext, useContext } from "react";
import { FormFieldsInterface } from "../types/core.types";

export interface CoreFormContextType<T extends Record<string, any> = any> {
  formState: T;
  initialState: T;
  setFormState: (data: Partial<T>) => void;
  setField: (key: keyof T, value: any) => void;
  reset: () => void;

  formFields: FormFieldsInterface<any, T>;
  schema: any;
  resource: string;
  title: string;
}

export const CoreFormContext = createContext<CoreFormContextType | null>(null);

export const useCoreForm = <T extends Record<string, any>>(): CoreFormContextType<T> => {
  const context = useContext(CoreFormContext);
  if (!context) throw new Error("useCoreForm must be used within CoreFormProvider");
  return context as CoreFormContextType<T>;
};
