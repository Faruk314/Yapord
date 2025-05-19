"use client";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaUserFriends } from "react-icons/fa";
import classNames from "classnames";

const navItems = [
  {
    href: "/home",
    icon: <LayoutDashboard className="text-pink-600" size={25} />,
    label: "Home",
  },
  {
    href: "/home/friends",
    icon: <FaUserFriends className="text-pink-600" size={25} />,
    label: "Friends",
  },
];

export default function HomeNavigation() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-300 py-4">
      {navItems.map(({ href, icon, label }) => (
        <Link href={href} key={href}>
          <div
            className={classNames(
              "flex items-center space-x-2 hover:bg-gray-100 mx-2 p-2 rounded-md",
              {
                "bg-gray-100": pathname === href,
              }
            )}
          >
            {icon}
            <span className="text-sm font-black uppercase">{label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
