"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryBtn } from "../../../components/ui/PrimaryBtn";
import ImageUploader from "../../../components/ui/ImageUploader";
import { useForm } from "react-hook-form";
import { serverSchema } from "@/features/servers/schemas/servers";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServer, updateServer } from "../actions/servers";
import { toast } from "sonner";
import { createMinioImageUrl } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface Props {
  userId: string;
  server?: {
    id: string;
    name: string;
    image: string | null;
  };
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ServerForm({ userId, server, setIsOpen }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: server ?? {
      name: "",
      image: null,
    },
  });
  const existingImage =
    typeof server?.image === "string"
      ? createMinioImageUrl(server.image)
      : undefined;

  function onFileUpload(file: File) {
    setValue("image", file, { shouldValidate: true });
  }

  async function onSubmit(values: z.infer<typeof serverSchema>) {
    const action =
      server == null ? createServer : updateServer.bind(null, server.id);

    const data = await action(userId, values);

    if (data.error) return toast.error(data.message);

    setIsOpen(false);

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
          <Label htmlFor="server-name" className="text-right">
            Name
          </Label>
          <Input
            placeholder="My Server"
            className="col-span-3"
            {...register("name", { required: "Server name is required" })}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <PrimaryBtn type="submit">
        {server ? "Confirm" : "Create Server"}
      </PrimaryBtn>
    </form>
  );
}
