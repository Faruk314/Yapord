"use client";

import { IconBtn } from "@/components/buttons/IconBtn";
import { Message } from "@/components/chat/Message";
import { ChatInput } from "@/components/inputs/ChatInput";
import { Iuser } from "@/features/auth/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getChatMessages } from "../db/chatMessages";
import { createChatMessage } from "../actions/chatMessages";
import { chatMessageSchema } from "../schemas/chatMessage";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "@/components/loaders/Spinner";

interface Props {
  chatId: string;
  recipientInfo: Iuser;
  senderInfo: Iuser;
}

export default function PrivateChat({
  chatId,
  recipientInfo,
  senderInfo,
}: Props) {
  const { handleSubmit, reset, register } = useForm({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
      chatId,
      senderId: senderInfo.id,
    },
  });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["chatMessages", chatId],
      queryFn: ({ pageParam = 0 }) => getChatMessages(chatId, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  async function onSubmit(values: z.infer<typeof chatMessageSchema>) {
    const data = await createChatMessage(values);

    if (data.error) {
      toast.error(data.message);

      return;
    }

    reset();
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-muted">
      <div
        id="chat-scroll"
        className="flex-1 flex flex-col-reverse overflow-y-auto pt-4 pb-2 bg-muted relative"
      >
        <InfiniteScroll
          dataLength={data?.pages.flatMap((p) => p.messages).length ?? 0}
          next={() => {
            if (!isFetchingNextPage) fetchNextPage();
          }}
          hasMore={hasNextPage ?? false}
          inverse={true}
          scrollableTarget="chat-scroll"
          loader={false}
        >
          {data?.pages
            .flatMap((page) => page.messages)
            .map((message, index, allMessages) => {
              const previousMessage = allMessages[index - 1];
              const isSameSenderAsPrevious =
                previousMessage?.senderId === message.senderId;

              const user =
                message.senderId === recipientInfo.id
                  ? recipientInfo
                  : senderInfo;

              return (
                <Message
                  key={message.id}
                  isSameSenderAsPrevious={isSameSenderAsPrevious}
                  senderName={user.name}
                  imageSrc={user.image}
                  createdAt={message.createdAt}
                  message={message.content}
                />
              );
            })}
        </InfiniteScroll>

        {isFetchingNextPage && (
          <div className="p-4 self-center">
            <Spinner />
          </div>
        )}
      </div>

      <div className="flex items-center rounded-md border border-gray-300 p-4 mx-4 mb-4 bg-white">
        <form className="flex justify-between w-full">
          <IconBtn type="button" className="h-8 w-8" icon={<Upload />} />
          <ChatInput
            placeholder={`Message ${recipientInfo.name}`}
            className="flex-1 resize-none border-none self-center"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
            {...register("content")}
          />
        </form>
      </div>
    </div>
  );
}
