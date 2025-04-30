import { PrimaryBtn } from "./PrimaryBtn";
import { oAuthSignIn } from "@/features/auth/actions/oauth";
import { FaDiscord } from "react-icons/fa";

export function DiscordBtn() {
  return (
    <PrimaryBtn
      type="button"
      onClick={async () => await oAuthSignIn("discord")}
      className="w-full flex items-center justify-center gap-2 bg-[#5865F2] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4752c4] transition-colors duration-200"
    >
      <FaDiscord className="text-xl" />
      DISCORD
    </PrimaryBtn>
  );
}
