"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ReactNode, createContext, useContext, useState, useRef } from "react";
import { IconInfo, IconTrash, IconTriangleAlert } from "../utils/icon.util";

type SwalConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning";
  icon?: ReactNode;
};

type ResolveFn = (value: boolean) => void;

const SwalConfirmContext = createContext<{
  swalConfirm: (options?: SwalConfirmOptions) => Promise<boolean>;
} | null>(null);

export function SwalConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SwalConfirmOptions>({
    title: "Tem certeza?",
    description: "Esta ação não pode ser desfeita.",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    variant: "default",
  });

  // Usamos useRef para guardar a função resolve sem causar re-renders
  const resolveRef = useRef<ResolveFn>(() => {});

  const swalConfirm = (opts?: SwalConfirmOptions): Promise<boolean> => {
    const variant = opts?.variant || "default";

    let icon = opts?.icon;
    if (!icon) {
      if (variant === "destructive") icon = <IconTrash className="h-6 w-6 text-destructive" />;
      else if (variant === "warning") icon = <IconTriangleAlert className="h-6 w-6 text-yellow-500" />;
      else icon = <IconInfo className="h-6 w-6 text-blue-500" />;
    }

    setOptions({
      title: opts?.title ?? "Tem certeza?",
      description: opts?.description ?? "Esta ação não pode ser desfeita.",
      confirmText: opts?.confirmText ?? "Confirmar",
      cancelText: opts?.cancelText ?? "Cancelar",
      variant,
      icon,
    });

    setOpen(true);

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve; // Agora é seguro: useRef não causa re-render
    });
  };

  const handleConfirm = () => {
    resolveRef.current(true);
    setOpen(false);
  };

  const handleCancel = () => {
    resolveRef.current(false);
    setOpen(false);
  };

  // Fecha ao clicar fora ou pressionar ESC
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resolveRef.current(false);
      setOpen(false);
    }
  };

  return (
    <SwalConfirmContext.Provider value={{ swalConfirm }}>
      {children}

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {options.icon && <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">{options.icon}</div>}
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>{options.cancelText}</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirm}
              className={options.variant === "destructive" ? "bg-destructive hover:bg-destructive/90" : options.variant === "warning" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : undefined}
            >
              {options.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SwalConfirmContext.Provider>
  );
}

export const useSwalConfirm = () => {
  const context = useContext(SwalConfirmContext);
  if (!context) {
    throw new Error("useSwalConfirm must be used within SwalConfirmProvider");
  }
  return context.swalConfirm;
};
