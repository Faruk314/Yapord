import FriendsNavigation from "@/components/navigation/FriendsNavigation";

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <FriendsNavigation />

      {children}
    </div>
  );
}
