import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function createUniqueFileNames(images: File[]) {
  const fileNames = images.map((image) => {
    const fileName = `${uuidv4()}-${image.name}`;
    return fileName;
  });

  return fileNames;
}

function createMinioImageUrl(imageSrc: string) {
  return `${process.env.NEXT_PUBLIC_MINIO_CLIENT_URL}/${imageSrc}`;
}

export { cn, createUniqueFileNames, createMinioImageUrl };
