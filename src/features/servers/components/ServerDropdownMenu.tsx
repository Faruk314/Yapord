"use client";

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FaUsers, FaTrash, FaEdit } from "react-icons/fa";
import ServerForm from "./ServerForm";
import { Server } from "../types/servers";
import { ModalWrapper } from "@/components/ui/ModalWrapper";
import { AlertDialogBox } from "@/components/ui/AlertDialog";
import { deleteServer } from "../actions/servers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ServerRole } from "@/drizzle/schema";
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
    <DropdownMenuContent align="end" className="w-56">
      {serverMemberRole !== "member" && (
        <ModalWrapper
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <FaEdit className="mr-2 h-4 w-4 text-muted-foreground" />
              Edit server
            </DropdownMenuItem>
          }
        >
          <ServerForm ownerId={ownerId} server={server} />
        </ModalWrapper>
      )}

      <ModalWrapper
        trigger={
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <FaUsers className="mr-2 h-4 w-4 text-muted-foreground" />
            Members
          </DropdownMenuItem>
        }
      >
        <ServerMembers />
      </ModalWrapper>

      {serverMemberRole === "owner" && (
        <AlertDialogBox
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-600 hover:text-red-700"
            >
              <FaTrash className="mr-2 h-4 w-4 text-red-500" />
              Delete Server
            </DropdownMenuItem>
          }
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete this server."
          onConfirm={handleDeleteServer}
          confirmText="Delete"
        />
      )}
    </DropdownMenuContent>
  );
}
