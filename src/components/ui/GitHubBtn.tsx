import { FaGithub } from "react-icons/fa";
import { PrimaryBtn } from "./PrimaryBtn";
import { oAuthSignIn } from "@/features/auth/actions/oauth";

export function GitHubBtn() {
  return (
    <PrimaryBtn
      type="button"
      onClick={async () => await oAuthSignIn("github")}
      className="w-full flex items-center justify-center gap-2 border border-black text-black font-semibold py-2 px-4 rounded-md bg-transparent hover:bg-gray-100 hover:text-black transition-colors duration-200"
    >
      <FaGithub className="text-xl" />
      GitHub
    </PrimaryBtn>
  );
}
