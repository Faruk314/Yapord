"use client";

import { FaUserFriends } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const navItems = [
  {
    href: "/home/friends",
    label: "Online",
  },
  {
    href: "/home/friends/all",
    label: "All",
  },
  {
    href: "/home/friends/pending",
    label: "Pending",
  },
  {
    href: "/home/friends/add",
    label: "Add friend",
  },
];

export default function FriendsNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-4 h-18 px-4 border-b border-gray-300">
      <div className="flex items-center space-x-2">
        <FaUserFriends className="text-pink-600" size={25} />
        <span className="text-sm font-black uppercase">friends</span>
      </div>

      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={classNames(
            "text-sm p-2 rounded-md font-black uppercase cursor-pointer",
            {
              "bg-gray-100 text-black": pathname === href,
            }
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
