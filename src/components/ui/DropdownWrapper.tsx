"use client";

import { ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiX } from "react-icons/hi";

interface props {
  children: ReactNode;
}

export function DropdownWrapper({ children }: props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {!isOpen ? (
          <MdOutlineKeyboardArrowDown className="text-2xl cursor-pointer" />
        ) : (
          <HiX className="text-2xl cursor-pointer" />
        )}
      </DropdownMenuTrigger>

      {children}
    </DropdownMenu>
  );
}
