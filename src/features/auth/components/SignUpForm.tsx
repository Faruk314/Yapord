"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { signUpSchema } from "../schemas/auth";
import { signUp } from "../actions/auth";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { PrimaryBtn } from "@/components/ui/PrimaryBtn";
import { zodResolver } from "@hookform/resolvers/zod";
import { DiscordBtn } from "@/components/ui/DiscordBtn";
import { GitHubBtn } from "@/components/ui/GitHubBtn";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    const error = await signUp(data);
    toast.error(error);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center space-y-4 items-center w-[20rem] shadow-md p-10 rounded-md"
    >
      <div className="w-full">
        <label className="block text-sm font-medium">Name</label>
        <Input
          {...register("name", { required: "Name is required", maxLength: 30 })}
          type="text"
          className="w-full p-2 border rounded-md"
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium">Email</label>
        <Input
          {...register("email", { required: "Email is required" })}
          type="email"
          className="w-full p-2 border rounded-md"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium">Password</label>
        <Input
          {...register("password", { required: "Password is required" })}
          type="password"
          className="w-full p-2 border rounded-md"
        />
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col w-full space-y-2">
        <PrimaryBtn type="submit" className="w-full">
          Sign Up
        </PrimaryBtn>

        <DiscordBtn />

        <GitHubBtn />
      </div>
    </form>
  );
}
