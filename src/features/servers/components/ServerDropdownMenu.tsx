"use client";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import { Server } from "../types/servers";
import { AlertDialogBox } from "@/components/ui/AlertDialog";
import { deleteServer } from "../actions/servers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ServerRole } from "@/drizzle/schema";
import { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiX } from "react-icons/hi";
import ServerForm from "./ServerForm";
import DialogWrapper from "@/components/DialogWrapper";
import ServerMembers from "./ServerMembers";

interface Props {
  ownerId: string;
  server: Server;
  serverMemberRole: ServerRole;
}

export function ServerDropdownMenu({
  ownerId,
  server,
  serverMemberRole,
}: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  const isModerator =
    serverMemberRole === "owner" || serverMemberRole === "admin";
  const isOwner = serverMemberRole === "owner";

  async function handleDeleteServer() {
    const data = await deleteServer(server.id);

    if (data.error) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);

    router.push("/private/home");
  }

  return (
    <>
      <DialogWrapper
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Server"
        description="Update your server’s name or settings. Changes will be saved immediately."
      >
        <ServerForm
          userId={ownerId}
          server={server}
          setIsOpen={setIsEditOpen}
        />
      </DialogWrapper>

      <DialogWrapper
        isOpen={isMembersOpen}
        setIsOpen={setIsMembersOpen}
        title="Server members"
      >
        <ServerMembers />
      </DialogWrapper>

      <AlertDialogBox
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete this server."
        onConfirm={handleDeleteServer}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        confirmText="Delete"
      />

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          {!isOpen ? (
            <MdOutlineKeyboardArrowDown className="text-2xl cursor-pointer" />
          ) : (
            <HiX className="text-2xl cursor-pointer" />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {isModerator && (
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <FaEdit className="mr-2 h-4 w-4 text-muted-foreground" />
              Edit server
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => setIsMembersOpen(true)}>
            <FaUsers className="mr-2 h-4 w-4 text-muted-foreground" />
            Members
          </DropdownMenuItem>

          {isOwner && (
            <DropdownMenuItem
              onClick={() => setIsDeleteOpen(true)}
              className="text-red-600 hover:text-red-700"
            >
              <FaTrash className="mr-2 h-4 w-4 text-red-500" />
              Delete Server
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
