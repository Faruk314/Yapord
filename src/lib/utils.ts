import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function createUniqueFileNames(images: File[]) {
  const fileNames = images.map((image) => {
    const fileName = `${uuidv4()}-${image.name}`;
    return fileName;
  });

  return fileNames;
}

export { createUniqueFileNames };
