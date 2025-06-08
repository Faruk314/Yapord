"use client";

import React, { useState } from "react";
import Avatar from "../ui/Avatar";
import { formatMessageTime } from "@/lib/utils";

interface Props {
  senderName: string;
  message: string;
  createdAt: Date;
  imageSrc: string | null;
  isSameSenderAsPrevious: boolean;
}

export function Message(props: Props) {
  const { senderName, message, isSameSenderAsPrevious, imageSrc, createdAt } =
    props;

  const [isHovering, setIsHovering] = useState(false);

  if (isSameSenderAsPrevious) {
    return (
      <div
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="flex items-baseline space-x-4 px-4 hover:bg-white rounded"
      >
        <span className="text-[0.8rem] w-12">
          {isHovering ? formatMessageTime(new Date(createdAt), true) : null}
        </span>

        <p className="break-all whitespace-pre-line">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 px-4 py-1 hover:bg-white rounded">
      <div className="shrink-0">
        <Avatar name={senderName} imageSrc={imageSrc} />
      </div>
      <div>
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">{senderName}</span>
          <span className="text-[0.8rem]">
            {formatMessageTime(new Date(createdAt))}
          </span>
        </div>
        <p className="break-all whitespace-pre-line">{message}</p>
      </div>
    </div>
  );
}
