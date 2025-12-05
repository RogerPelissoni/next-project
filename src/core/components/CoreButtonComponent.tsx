"use client";

import { Button } from "@/components/ui/button";

type CoreButtonProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg" | null | undefined;
  type?: "button" | "submit" | "reset" | undefined;
  variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
  onClick?: () => void;
};

export default function CoreButtonComponent({ children, className, size = "sm", type, variant = "default", onClick }: CoreButtonProps) {
  return (
    <Button className={className} size={size} type={type} variant={variant} onClick={onClick}>
      {children}
    </Button>
  );
}
