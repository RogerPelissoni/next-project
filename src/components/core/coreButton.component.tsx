"use client";

import { Button } from "@/components/ui/button";

type CoreButtonProps = {
  label: string;
  size?:
    | "sm"
    | "default"
    | "lg"
    | "icon"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
};

export default function CoreButtonComponent({
  label,
  size = "sm",
  type,
  onClick,
}: CoreButtonProps) {
  return (
    <Button size={size} type={type} onClick={onClick}>
      {label}
    </Button>
  );
}
