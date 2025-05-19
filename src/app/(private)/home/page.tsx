import { PrimaryBtn } from "@/components/buttons/PrimaryBtn";
import { SecondaryBtn } from "@/components/buttons/SecondaryBtn";
import { FaUserFriends } from "react-icons/fa";

export default async function HomePage() {
  return (
    <div>
      <div className="flex items-center space-x-4 h-18 px-4 border-b border-gray-300">
        <div className="flex items-center space-x-2">
          <FaUserFriends className="text-pink-600" size={25} />
          <span className="text-sm font-black uppercase">friends</span>
        </div>

        <SecondaryBtn>Online</SecondaryBtn>

        <SecondaryBtn>All</SecondaryBtn>

        <PrimaryBtn>Add friend</PrimaryBtn>
      </div>
    </div>
  );
}
