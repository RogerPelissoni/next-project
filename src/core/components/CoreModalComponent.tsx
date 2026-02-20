"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as React from "react";

type CoreModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export default function CoreModalComponent({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: CoreModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        <div className="py-2">{children}</div>

        {footer && <div className="flex justify-end gap-2 pt-4">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
