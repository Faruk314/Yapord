"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Camera } from "lucide-react";
import { IconBtn } from "./IconBtn";
import { FaPlus } from "react-icons/fa";

interface ImageUploaderProps {
  onFileUpload: (file: File) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileUpload,
  multiple = false,
  maxFiles = 1,
  className = "",
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple,
    maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative flex items-center justify-center text-[0.8rem] border-2 border-dashed border-gray-300 rounded-full h-30 w-30 text-center cursor-pointer transition hover:border-pink-500 ${className}`}
    >
      {!preview && (
        <IconBtn icon={<FaPlus />} className="absolute top-0 right-0 h-8 w-8" />
      )}
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-pink-500">Drop the image...</p>
      ) : preview ? (
        <img
          src={preview}
          alt="Preview"
          className="object-cover w-full h-full rounded-full"
        />
      ) : (
        <div className="flex flex-col justify-center items-center text-gray-500 text-xl font-black">
          <Camera size={32} />
          <p>UPLOAD</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
