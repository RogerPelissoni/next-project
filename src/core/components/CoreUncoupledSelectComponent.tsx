import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Option = { label: string; value: string };

type Props = {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  options: Option[];
};

export function CoreUncoupledSelect({ value, onChange, placeholder = "Selecione...", options }: Props) {
  return (
    <Select value={value ?? "__empty"} onValueChange={(v) => onChange?.(v === "__empty" ? undefined : v)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="__empty">{placeholder}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
