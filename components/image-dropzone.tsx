"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { toBase64 } from "@/lib";
import DropzoneComponent from "react-dropzone";

export default function ImageDropzone() {
  const [loading, setLoading] = useState(false);
  const [blobURL, setBlobURL] = useState<string | null>(null);

  const onDrop = async (acceptedFile: File[]) => {
    if (!acceptedFile || loading) return;
    const file = acceptedFile[0];
    const base64 = await toBase64(file);
    setBlobURL(URL.createObjectURL(file));
    console.log(file);
  };

  return (
    <DropzoneComponent disabled={loading} onDrop={onDrop}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
        return (
          <>
            <div
              {...getRootProps()}
              className={clsx(
                "max-w-[708px] h-[396px] object-cover relative group select-none grow w-full mt-10 flex justify-center items-center p-5 border border-dashed rounded-lg text-center cursor-pointer",
                isDragActive
                  ? "bg-[#035ffe] text-white animate-pulse"
                  : "bg-slate-100/50 dark:bg-slate=800/80 text-slate-400",
                loading && "cursor-not-allowed"
              )}
            >
              <input {...getInputProps({ multiple: false })} />
              {blobURL ? (
                <Image
                  src={blobURL}
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                  alt="Uploaded image"
                />
              ) : (
                <>
                  {!isDragActive && "Click here or drop a file to upload"}
                  {isDragActive && !isDragReject && "Drop to upload this file!"}
                  {isDragReject && "File type not accepted, sorry!!"}
                </>
              )}
            </div>
          </>
        );
      }}
    </DropzoneComponent>
  );
}
