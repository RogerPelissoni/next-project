"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { Control, FieldValues, Path } from "react-hook-form";
import { OptionType } from "../utils/core.util";

type CoreSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  options: OptionType[];
};

export function CoreSelectComponent<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "Selecione...",
  options,
}: CoreSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="mx-2">
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <Select
              value={field.value ?? "__empty"}
              onValueChange={(v) => field.onChange(v === "__empty" ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="__empty">Selecione</SelectItem>

                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
