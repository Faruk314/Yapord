import { ReactNode } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface ModalWrapperProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function ModalWrapper({ trigger, children }: ModalWrapperProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {children}
    </Dialog>
  );
}
