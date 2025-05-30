"use client";

import { ChatInput } from "@/components/inputs/ChatInput";
import { Message } from "@/components/chat/Message";
import { IconBtn } from "@/components/buttons/IconBtn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { channelMessageSchema } from "../schemas/channelMessage";
import { z } from "zod";
import { createChannelMessage } from "../actions/channelMessages";
import { toast } from "sonner";
import { IchannelMessage } from "../types/channel";
import { useChannelChatStore } from "../store/channelChat";
import { useEffect } from "react";

interface Props {
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  channel: {
    id: string;
    name: string;
    messages: IchannelMessage[];
  };
}

export default function ChannelChat({ user, channel }: Props) {
  const setMessages = useChannelChatStore((state) => state.setMessages);
  const addMessage = useChannelChatStore((state) => state.addMessage);
  const channelMessages = useChannelChatStore((state) => state.channelMessages);

  const { handleSubmit, reset, register } = useForm({
    resolver: zodResolver(channelMessageSchema),
    defaultValues: { content: "", senderId: user.id, channelId: channel.id },
  });

  useEffect(() => {
    setMessages(channel.messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: z.infer<typeof channelMessageSchema>) {
    const data = await createChannelMessage(channel.id, values);

    if (data.error) {
      toast.error(data.message);
      return;
    }

    if (!data.messageData) return;

    addMessage({ ...data.messageData, user });

    reset();
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-muted">
      <div className="flex-1 overflow-y-auto pt-4 pb-2 bg-muted">
        {channelMessages.map((message, index) => {
          const previousMessage = channelMessages[index - 1];
          const isSameSenderAsPrevious =
            previousMessage?.user.id === message.user.id;

          return (
            <Message
              key={message.id}
              isSameSenderAsPrevious={isSameSenderAsPrevious}
              senderName={message.user.name}
              imageSrc={message.user.image}
              message={message.content}
            />
          );
        })}
      </div>

      <div className="flex items-center rounded-md border border-gray-300 p-4 mx-4 mb-4 bg-white">
        <form className="flex justify-between w-full">
          <IconBtn type="button" className="h-8 w-8" icon={<Upload />} />
          <ChatInput
            placeholder={`Message in ${channel.name}`}
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
