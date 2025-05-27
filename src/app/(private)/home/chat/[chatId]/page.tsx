import { getCurrentUser } from "@/features/auth/actions/user";
import PrivateChat from "@/features/chats/components/PrivateChat";
import PrivateChatHeader from "@/features/chats/components/PrivateChatHeader";
import { getChatMessages } from "@/features/chats/db/chatMessages";
import { getChatParticipant } from "@/features/chats/db/chatParticipants";
import { getQueryClient } from "@/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
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
        <PrivateChatHeader
          chatId={chatId}
          userInfo={user}
          recipientInfo={recipientInfo}
        />

        <PrivateChat
          chatId={chatId}
          recipientInfo={recipientInfo}
          senderInfo={{ id: user.id, name: user.name, image: user.image }}
        />
      </div>
    </HydrationBoundary>
  );
}
