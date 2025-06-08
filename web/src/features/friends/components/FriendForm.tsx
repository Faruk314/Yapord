"use client";

import { PrimaryBtn } from "@/components/buttons/PrimaryBtn";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { z } from "zod";
import { friendRequestSchema } from "../schemas/friendRequest";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { createFriendRequest } from "../actions/friendRequests";

export default function FriendForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof friendRequestSchema>>({
    resolver: zodResolver(friendRequestSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof friendRequestSchema>) {
    const response = await createFriendRequest(values);

    if (response.error) {
      toast.error(response.message);

      return;
    }

    toast.success(response.message);

    reset();
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center px-2 max-w-[50rem] justify-between border rounded-md focus-within:outline focus-within:outline-gray-300"
      >
        <input
          className="outline-none py-3 w-full"
          {...register("name", {
            min: 2,
            required: "Name must contain 2 letters min",
          })}
        />

        <PrimaryBtn type="submit">Send friend request</PrimaryBtn>
      </form>

      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}
    </>
  );
}
