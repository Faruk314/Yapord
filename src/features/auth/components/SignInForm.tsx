"use client";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInSchema } from "../schemas/auth";
import { signIn } from "../actions/auth";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { PrimaryBtn } from "@/components/buttons/PrimaryBtn";
import Link from "next/link";
import { DiscordBtn } from "@/components/buttons/DiscordBtn";
import { GitHubBtn } from "@/components/buttons/GitHubBtn";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    const error = await signIn(data);
    toast.error(error);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center space-y-4 items-center w-[20rem] shadow-md p-10 rounded-md"
    >
      <div className="flex flex-col space-y-1 w-full">
        <label className="block text-sm font-medium">Email</label>

        <Input
          {...register("email", { required: "Email is required" })}
          type="text"
          className="w-full p-2 border rounded-md"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col space-y-1 w-full">
        <label className="block text-sm font-medium">Password</label>

        <Input
          {...register("password", { required: "Password is required" })}
          type="password"
          className="w-full p-2 border rounded-md"
        />

        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div className="flex flex-col w-full space-y-2">
        <PrimaryBtn className="w-full" type="submit">
          Sign In
        </PrimaryBtn>

        <DiscordBtn />

        <GitHubBtn />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center w-full">
        <hr className="border-gray-400" />
        <span>OR</span>
        <hr className="border-gray-400" />
      </div>

      <div className="w-full text-center">
        <Link href="/signUp">
          <PrimaryBtn className="w-full">CREATE ACCOUNT</PrimaryBtn>
        </Link>
      </div>
    </form>
  );
}
