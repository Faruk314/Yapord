import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

export function SecondaryBtn({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className={cn(
        "bg-transparent hover:bg-gray-200 cursor-pointer font-black uppercase shadow-none text-black",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
