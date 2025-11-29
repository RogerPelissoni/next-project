"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control, FieldValues, Path } from "react-hook-form";

type CoreCheckboxProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
};

export function CoreCheckboxComponent<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: CoreCheckboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-start gap-3 mx-2">
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>

          <div>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
