import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  imageSrc?: string | null;
  className?: string;
}

export default function Avatar({ imageSrc, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative w-12 h-12 rounded-full overflow-hidden",
        "bg-pink-600 text-white font-black uppercase",
        "flex items-center justify-center",
        className
      )}
    >
      {imageSrc ? (
        <Image src={imageSrc} alt="" fill className="object-cover" />
      ) : (
        <span className="text-xl z-10">F</span>
      )}
    </span>
  );
}
