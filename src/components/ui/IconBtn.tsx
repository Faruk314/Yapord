import { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

export function IconBtn({ icon, className, ...props }: IconButtonProps) {
  return (
    <Button
      className={cn(
        "bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-500 cursor-pointer w-12 h-12",
        className
      )}
      {...props}
    >
      {icon}
    </Button>
  );
}
