import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Spinner({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-8 w-8 border-4 border-gray-300 border-t-pink-600 rounded-full animate-spin",
        className
      )}
      {...props}
    ></div>
  );
}
