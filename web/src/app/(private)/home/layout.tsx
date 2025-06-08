import HomeNavigation from "@/components/navigation/HomeNavigation";
import Avatar from "@/components/ui/Avatar";

export default async function HomeNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const directMessages: string[] = [];
  return (
    <>
      <div className="border-r border-gray-300 overflow-y-auto h-[100vh] lg:w-[20rem]">
        <HomeNavigation />

        <div className="p-4">
          <span className="font-semibold uppercase">Direct Messages</span>

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
