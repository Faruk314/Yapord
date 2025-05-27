import React from "react";
import Image from "next/image";
import { cn, createMinioImageUrl } from "@/lib/utils";

interface AvatarProps {
  imageSrc?: string | null;
  name?: string;
  className?: string;
}

export default function Avatar({ imageSrc, className, name }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative w-12 h-12 rounded-full overflow-hidden",
        "text-white text-xl font-black uppercase bg-pink-600 shadow-md",
        "flex items-center justify-center",
        className
      )}
    >
      {imageSrc ? (
        <Image
          src={createMinioImageUrl(imageSrc)}
          alt={`images`}
          fill={true}
          className="bg-white"
        />
      ) : (
        <span className="z-10">{name?.slice(0, 1)}</span>
      )}
    </span>
  );
}
