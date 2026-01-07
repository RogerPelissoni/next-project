"use client";

import { useForm, Control, FieldValues, Path, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import { CoreInputTextComponent } from "./CoreInputTextComponent";
import { CoreSelectComponent } from "./CoreSelectComponent";
import { CoreInputDateComponent } from "./CoreInputDateComponent";
import { IconSave } from "../utils/icon.util";
import { useCoreForm } from "../form/CoreFormContext";
import CoreButtonComponent from "./CoreButtonComponent";
import { OptionType } from "../utils/core.util";

type FieldInterface = {
  type: "text" | "password" | "select" | "date";
  label: string;
  options?: OptionType[];
};

export type CoreFormProps<TFieldValues extends FieldValues> = {
  onSubmit?: (values: TFieldValues) => void | Promise<void>;
  className?: string;
  templateBottom?: React.ReactNode;
  submitButtonText: string;
};

export default function CoreFormComponent<TFieldValues extends FieldValues>({ onSubmit, className, templateBottom, submitButtonText = "Salvar" }: CoreFormProps<TFieldValues>) {
  const coreForm = useCoreForm();

  const form = useForm<TFieldValues>({
    resolver: zodResolver(coreForm.schema) as unknown as Resolver<TFieldValues>,
    defaultValues: coreForm.formState as DefaultValues<TFieldValues> | undefined,
  });

  const handleSubmit = async (data: TFieldValues) => {
    if (onSubmit) await onSubmit(data);
  };

  type Key = keyof TFieldValues & string;
  const keys = Object.keys(coreForm.formFields.main.fields) as Key[];

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
        return <CoreInputTextComponent<TFieldValues> key={key} {...commonProps} type={cfg.type === "password" ? "password" : "text"} />;

      case "select":
        return <CoreSelectComponent<TFieldValues> key={key} {...commonProps} options={cfg.options ?? []} />;

      case "date":
        return <CoreInputDateComponent<TFieldValues> key={key} {...commonProps} />;

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={`flex flex-wrap items-start space-y-4 mt-4 ${className ?? ""}`}>
        {keys.map((key) => renderField(key, coreForm.formFields.main.fields[key]))}

        {templateBottom}

        <Separator className="w-full my-2 mb-4" />

        <div className="w-full flex justify-end">
          <CoreButtonComponent type="submit">
            <IconSave /> {submitButtonText}
          </CoreButtonComponent>
        </div>
      </form>
    </Form>
  );
}
