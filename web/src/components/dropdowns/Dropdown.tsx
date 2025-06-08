"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface DropdownProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function Dropdown({ label, children, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        className={cn("flex space-x-2 items-center cursor-pointer", className)}
        onClick={handleToggle}
      >
        <span className="font-semibold">{label}</span>
        <MdOutlineKeyboardArrowDown
          className={cn("text-xl transition-transform", {
            "rotate-180": !isOpen,
          })}
        />
      </button>

      {isOpen && <>{children}</>}
    </div>
  );
}
