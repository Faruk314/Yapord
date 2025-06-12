"use client";

import React, { useEffect, useRef } from "react";
import { Iuser } from "@/features/auth/types/user";
import Avatar from "@/components/ui/Avatar";
import { Iconsumer } from "../types/mediasoup";

interface Props {
  consumer?: Iconsumer;
  localConsumer?: { user: Iuser; localStream: MediaStream | null };
}

export default function CallAvatar({ consumer, localConsumer }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const effectiveStream =
    localConsumer?.localStream ?? localConsumer?.localStream ?? null;
  const effectiveUser = localConsumer?.user ?? consumer?.appData?.user;

  const hasVideoTrack =
    consumer?.track?.kind === "video" && consumer.track.enabled;
  const showFallback = !effectiveStream && !hasVideoTrack;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (effectiveStream) {
      video.srcObject = effectiveStream;
    } else if (consumer?.track) {
      const stream = new MediaStream([consumer.track]);
      video.srcObject = stream;
    }

    return () => {
      if (video) {
        video.srcObject = null;
      }
    };
  }, [consumer?.track, effectiveStream]);

  if (showFallback) {
    return (
      <div className="relative flex items-center justify-center h-25 w-50 border rounded-md">
        <Avatar
          name={effectiveUser?.name ?? "Unknown"}
          imageSrc={effectiveUser?.image}
        />
        <span className="absolute bottom-2 bg-black opacity-[0.8] text-white rounded-md px-2 left-2 text-xl text-[0.8rem] font-semibold">
          {effectiveUser?.name ?? "Unknown"}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-25 w-50 border rounded-md">
      <video
        className="h-full w-full rounded-md"
        ref={videoRef}
        autoPlay
        playsInline
        muted={Boolean(localConsumer)}
      />
      <span className="absolute bottom-2 bg-black opacity-[0.8] text-white rounded-md px-2 left-2 text-xl text-[0.8rem] font-semibold">
        {effectiveUser?.name ?? "Unknown"}
      </span>
    </div>
  );
}
