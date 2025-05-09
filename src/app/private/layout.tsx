import { IconBtn } from "@/components/ui/IconBtn";
import { ModalWrapper } from "@/components/ui/ModalWrapper";
import { getCurrentUser } from "@/features/auth/actions/user";
import ServerForm from "@/features/servers/components/ServerForm";
import ServerList from "@/features/servers/components/ServerList";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { PiPlusCircleBold } from "react-icons/pi";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid grid-cols-[auto_1fr] lg:grid-cols-[auto_auto_1fr] min-h-screen">
      <SideBar />
      <>{children}</>
    </main>
  );
}

export async function SideBar() {
  const user = await getCurrentUser({ redirectIfNotFound: true });

  return (
    <div className="flex flex-col space-y-2 p-4 border-r-2 border-gray-300">
      <Link
        href={`/private/home/`}
        className="cursor-pointer flex items-center justify-center relative w-12 h-12 rounded-full overflow-hidden bg-blue-600 text-white font-black uppercase"
      >
        <FaDiscord size={26} />
      </Link>

      <ServerList userId={user.id} />

      <ModalWrapper trigger={<IconBtn icon={<PiPlusCircleBold />} />}>
        <ServerForm ownerId={user.id} />
      </ModalWrapper>
    </div>
  );
}
