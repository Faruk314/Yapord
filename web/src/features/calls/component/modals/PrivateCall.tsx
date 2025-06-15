"use client";

import { IconBtn } from "@/components/buttons/IconBtn";
import Avatar from "@/components/ui/Avatar";
import { Iuser } from "@/features/auth/types/user";
import { Fullscreen, Mic, PhoneOff, ScreenShare, Video } from "lucide-react";
import React, { useState } from "react";
import classNames from "classnames";
import CallAvatar from "../CallAvatar";
import { useMediasoupStore } from "../../store/mediasoup";
import useCallManager from "../../hooks/mediasoup/useCallManager";

interface Props {
  userInfo: Iuser;
  recipientInfo: Iuser;
  type: "video" | "audio";
}

export default function PrivateCall({ userInfo, recipientInfo }: Props) {
  const [openFullScreen, setOpenFullScreen] = useState(false);
  const { leaveCall, toogleCamera, toogleScreenShare } = useCallManager();
  const consumers = useMediasoupStore((state) => state.consumers);
  const getLocalStream = useMediasoupStore((state) => state.getLocalStream);
  const producers = useMediasoupStore((state) => state.producers);
  const getConsumer = useMediasoupStore((state) => state.getConsumerByUserId);

  console.log(consumers, "consumers");

  console.log(producers, "producers");

  function handleFullScreen() {
    setOpenFullScreen((prev) => !prev);
  }

  return (
    <div
      className={classNames(
        "flex flex-col justify-between bg-white z-30 w-full top-0 right-0 shadow-sm",
        {
          absolute: !openFullScreen,
          "fixed h-full": openFullScreen,
        }
      )}
    >
      <div className="flex items-center space-x-4 border-b border-b-gray-300 p-4">
        <Avatar
          className="h-9 w-9"
          name={recipientInfo.name}
          imageSrc={recipientInfo.image}
        />
        <span className="text-xl font-semibold">{recipientInfo.name}</span>
      </div>

      <div className="flex space-x-4 items-center justify-center pb-4 pt-10">
        {Array.from(producers.entries())
          .filter(([type]) => type === "screen")
          .map(([type]) => (
            <CallAvatar
              key={type}
              localConsumer={{
                user: userInfo,
                localStream: getLocalStream(type) ?? null,
              }}
            />
          ))}

        {Array.from(consumers.entries())
          .filter(
            ([, consumer]) => consumer.appData?.streamType === "screenShare"
          )
          .map(([id, consumer]) => (
            <CallAvatar key={id} consumer={consumer} />
          ))}

        <CallAvatar
          localConsumer={{
            user: userInfo,
            localStream: getLocalStream("webcam") ?? null,
          }}
        />

        <CallAvatar
          localConsumer={{ user: recipientInfo, localStream: null }}
          consumer={getConsumer(recipientInfo.id)}
        />
      </div>

      <div className="relative mb-4">
        <div className="flex space-x-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <IconBtn onClick={toogleCamera} icon={<Video />} />
          <IconBtn onClick={toogleScreenShare} icon={<ScreenShare />} />
          <IconBtn icon={<Mic />} />

          <IconBtn
            onClick={leaveCall}
            className="bg-red-600 hover:bg-red-500"
            icon={<PhoneOff />}
          />
        </div>

        <div className="flex justify-end items-center space-x-2 mr-4">
          <IconBtn onClick={handleFullScreen} icon={<Fullscreen />} />
        </div>
      </div>
    </div>
  );
}
