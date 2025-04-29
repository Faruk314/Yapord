import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

export function PrimaryBtn({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className={cn(
        "bg-pink-600 cursor-pointer font-black uppercase hover:bg-pink-500",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
