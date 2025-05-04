import { z } from "zod";

export const serverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z
    .union([z.instanceof(File), z.string(), z.null()])
    .refine(
      (file) =>
        file === null ||
        typeof file === "string" ||
        file.size <= 5 * 1024 * 1024,
      "Image must be under 5MB"
    )
    .refine(
      (file) =>
        file === null ||
        typeof file === "string" ||
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, or WEBP images are allowed"
    ),
});
