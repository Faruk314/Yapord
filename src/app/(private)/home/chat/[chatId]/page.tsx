import { IconBtn } from "@/components/buttons/IconBtn";
import Avatar from "@/components/ui/Avatar";
import { getCurrentUser } from "@/features/auth/actions/user";
import PrivateChat from "@/features/chats/components/PrivateChat";
import { getChatMessages } from "@/features/chats/db/chatMessages";
import { getChatParticipant } from "@/features/chats/db/chatParticipants";
import { getQueryClient } from "@/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Phone, Video } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export default async function PrivateChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  const { chatId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: ({ pageParam = 0 }) => getChatMessages(chatId, pageParam),
    initialPageParam: 0,
  });

  const recipientInfo = await getChatParticipant(chatId, user.id);

  if (!recipientInfo) redirect("/home");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between h-18 px-4 border-b border-gray-300">
          <div className="flex items-center space-x-4 ">
            <Avatar
              className="h-9 w-9"
              name={recipientInfo.name}
              imageSrc={recipientInfo.image}
            />
            <span className="text-xl font-semibold">{recipientInfo.name}</span>
          </div>

          <div className="flex items-center space-x-4">
            <IconBtn className="h-9 w-9" icon={<Phone />} />
            <IconBtn className="h-9 w-9" icon={<Video />} />
          </div>
        </div>

        <PrivateChat
          chatId={chatId}
          recipientInfo={recipientInfo}
          senderInfo={{ id: user.id, name: user.name, image: user.image }}
        />
      </div>
    </HydrationBoundary>
  );
}
