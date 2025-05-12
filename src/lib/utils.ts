import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { format, isYesterday, isToday } from "date-fns";

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

function formatMessageTime(date: Date): string {
  if (isToday(date)) {
    return format(date, "h:mm a");
  }

  return format(date, "MMMM d 'at' h:mm a");
}

export { cn, createUniqueFileNames, createMinioImageUrl, formatMessageTime };
