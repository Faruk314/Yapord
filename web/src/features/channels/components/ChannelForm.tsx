"use client";

import { PrimaryBtn } from "@/components/buttons/PrimaryBtn";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { channelSchema } from "../schemas/channel";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { createChannel } from "../actions/channels";
import { ChannelType } from "@/drizzle/schema";

interface Props {
  serverId: string;
  channelType: ChannelType;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ChannelForm({
  serverId,
  channelType,
  setIsOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof channelSchema>>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
      type: channelType,
    },
  });

  async function onSubmit(values: z.infer<typeof channelSchema>) {
    const data = await createChannel(serverId, values);

    if (data.error) {
      toast.error(data.message);

      return;
    }

    toast.success(data.message);

    setIsOpen(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
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

      <PrimaryBtn type="submit">Create channel</PrimaryBtn>
    </form>
  );
}
