"use client";

import { ReactNode } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Portal } from "@radix-ui/react-dialog";

interface ModalWrapperProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function ModalWrapper({ trigger, children }: ModalWrapperProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <Portal>{children}</Portal>
    </Dialog>
  );
}
