"use client";

import { useForm, Control, FieldValues, Path, DefaultValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import CoreButtonComponent from "./coreButton.component";
import { CoreInputComponent } from "./coreInput.component";
import { CoreSelectComponent } from "./coreSelect.component";
import { CoreDateComponent } from "./coreDate.component";

type FieldInterface = {
  type: "text" | "password" | "select" | "date";
  label: string;
  options?: { label: string; value: string }[];
};

type FormFieldsShape<T> = {
  main: {
    fields: Record<keyof T & string, FieldInterface>;
  };
};

export type CoreFormProps<TFieldValues extends FieldValues> = {
  schema: z.ZodType<TFieldValues, any, any>; // Zod schema que produz TFieldValues no output
  formFields: FormFieldsShape<TFieldValues>;
  defaultValues?: DefaultValues<TFieldValues>;
  onSubmit?: (values: TFieldValues) => void | Promise<void>;
  className?: string;
};

export default function CoreFormComponent<TFieldValues extends FieldValues>({ schema, formFields, defaultValues, onSubmit, className }: CoreFormProps<TFieldValues>) {
  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema) as unknown as Resolver<TFieldValues>,
    defaultValues: defaultValues as DefaultValues<TFieldValues> | undefined,
  });

  const handleSubmit = async (data: TFieldValues) => {
    if (onSubmit) await onSubmit(data);
    else {
      console.log("Form submit:", data);
    }
  };

  type Key = keyof TFieldValues & string;
  const keys = Object.keys(formFields.main.fields) as Key[];

  const renderField = (key: Key, cfg: FieldInterface) => {
    const name = key as Path<TFieldValues>;

    const commonProps = {
      control: form.control as Control<TFieldValues>,
      name,
      label: cfg.label,
      placeholder: cfg.label,
    };

    switch (cfg.type) {
      case "password":
      case "text":
        return <CoreInputComponent<TFieldValues> key={key} {...commonProps} type={cfg.type === "password" ? "password" : "text"} />;

      case "select":
        return <CoreSelectComponent<TFieldValues> key={key} {...commonProps} options={cfg.options ?? []} />;

      case "date":
        return <CoreDateComponent<TFieldValues> key={key} {...commonProps} />;

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={`flex flex-wrap items-start space-y-4 mt-4 ${className ?? ""}`}>
        {keys.map((key) => renderField(key, formFields.main.fields[key]))}

        <Separator className="w-full my-2" />

        <div className="w-full flex justify-end">
          <CoreButtonComponent type="submit" label="Salvar" />
        </div>
      </form>
    </Form>
  );
}
