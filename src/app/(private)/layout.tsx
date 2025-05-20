import { getCurrentUser } from "@/features/auth/actions/user";
import UserSettingsFooter from "@/features/auth/components/UserSettingsFooter";
import ServerList from "@/features/servers/components/ServerList";
import CreateServer from "@/features/servers/components/modals/CreateServer";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  return (
    <main className="grid grid-cols-[auto_1fr] lg:grid-cols-[auto_auto_1fr] min-h-screen">
      <SideBar />
      <>{children}</>

      <UserSettingsFooter user={user} />
    </main>
  );
}

export async function SideBar() {
  const user = await getCurrentUser({ redirectIfNotFound: true });

  return (
    <div className="flex flex-col space-y-2 p-4 border-r border-gray-300">
      <Link
        href={`/home/`}
        className="cursor-pointer flex items-center justify-center relative w-12 h-12 rounded-full overflow-hidden bg-blue-600 text-white font-black uppercase"
      >
        <FaDiscord size={26} />
      </Link>

      <ServerList userId={user.id} />

      <CreateServer userId={user.id} />
    </div>
  );
}
