import { FaUserFriends } from "react-icons/fa";
import Link from "next/link";

const navItems = [
  {
    href: "/home/friends/online",
    label: "Online",
    className:
      "bg-transparent hover:bg-gray-100 cursor-pointer text-sm p-2 rounded-md font-black uppercase shadow-none text-black",
  },
  {
    href: "/home/friends/all",
    label: "All",
    className:
      "bg-transparent hover:bg-gray-100 cursor-pointer text-sm p-2 rounded-md font-black uppercase shadow-none text-black",
  },
  {
    href: "/home/friends/add",
    label: "Add friend",
    className:
      "bg-pink-600 p-2 text-white text-sm hover:bg-pink-400 rounded-md cursor-pointer font-black uppercase",
  },
];

export default function FriendsNavigation() {
  return (
    <div className="flex items-center space-x-4 h-18 px-4 border-b border-gray-300">
      <div className="flex items-center space-x-2">
        <FaUserFriends className="text-pink-600" size={25} />
        <span className="text-sm font-black uppercase">friends</span>
      </div>

      {navItems.map(({ href, label, className }) => (
        <Link href={href} key={href} className={className}>
          {label}
        </Link>
      ))}
    </div>
  );
}
