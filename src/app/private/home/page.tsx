import { PrimaryBtn } from "@/components/ui/PrimaryBtn";
import { logOut } from "@/features/auth/actions/auth";

export default async function HomePage() {
  return (
    <section className="">
      <div className="flex justify-between p-4">
        <span className="text-2xl font-black uppercase">home page</span>
        <PrimaryBtn onClick={logOut}>Log Out</PrimaryBtn>
      </div>
    </section>
  );
}
