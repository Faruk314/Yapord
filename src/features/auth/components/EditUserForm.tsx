"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryBtn } from "@/components/ui/PrimaryBtn";
import ImageUploader from "@/components/ui/ImageUploader";
import { z } from "zod";
import { userSchema } from "../schemas/user";
import { createMinioImageUrl } from "@/lib/utils";
import { updateUser } from "../actions/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface Props {
  user: z.infer<typeof userSchema>;
  userId: string;
}

export default function EditUserForm({ user, userId }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: user,
  });
  const existingImage =
    typeof user?.image === "string"
      ? createMinioImageUrl(user.image)
      : undefined;

  function onFileUpload(file: File) {
    setValue("image", file, { shouldValidate: true });
  }

  async function onSubmit(values: z.infer<typeof userSchema>) {
    const data = await updateUser(userId, values);

    if (data.error) return toast.error(data.message);

    toast.success(data.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-center my-10">
        <ImageUploader
          onFileUpload={onFileUpload}
          existingImage={existingImage}
        />
      </div>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            placeholder="Name"
            className="col-span-3"
            {...register("name", { required: "Name is required" })}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <PrimaryBtn type="submit">Save changes</PrimaryBtn>
    </form>
  );
}
