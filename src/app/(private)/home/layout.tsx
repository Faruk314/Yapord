import Avatar from "@/components/ui/Avatar";
import { getCurrentUser } from "@/features/auth/actions/user";
import EditUser from "@/features/auth/components/modals/EditUser";
import { userSchema } from "@/features/auth/schemas/user";
import { z } from "zod";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  const directMessages: string[] = [];
  return (
    <>
      <div className="border-r-2 border-gray-300 overflow-y-auto h-[100vh]">
        <HomeHeader
          userId={user.id}
          user={{ name: user.name, image: user.image }}
        />
        <div className="p-4">
          <span className="font-semibold">Direct Messages</span>

          <div className="flex flex-col space-y-3 pt-4">
            {directMessages.length > 0 ? (
              directMessages.map((server) => (
                <button
                  key={server}
                  className="flex items-center space-x-4 hover:bg-gray-100 hover:rounded-md cursor-pointer"
                >
                  <Avatar className="w-10 h-10" />

                  <span className="text-gray-500">Faruk Spahic</span>
                </button>
              ))
            ) : (
              <span className="text-[0.9rem]">
                You dont have any private messages
              </span>
            )}
          </div>
        </div>
      </div>
      {children}
    </>
  );
}

export async function HomeHeader({
  userId,
  user,
}: {
  userId: string;
  user: z.infer<typeof userSchema>;
}) {
  return (
    <div className="flex items-center justify-between lg:w-[20rem] py-4 px-4 border-b-2 border-gray-300">
      <span className="text-xl font-semibold">Faruk Spahic</span>

      <EditUser user={user} userId={userId} />
    </div>
  );
}
