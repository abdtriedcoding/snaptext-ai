"use client";

import clsx from "clsx";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { CopyIcon } from "lucide-react";
import { useCompletion } from "ai/react";
import DropzoneComponent from "react-dropzone";
import { isSupportedImageType, toBase64 } from "@/lib";

export default function ImageDropzone() {
  const [blobURL, setBlobURL] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const { complete, completion, isLoading } = useCompletion({
    onError: (e) => {
      toast.error(e.message);
      setBlobURL(null);
    },
    onFinish: () => setFinished(true),
  });

  const onDrop = async (acceptedFile: File[]) => {
    if (!acceptedFile || isLoading) return;
    const file = acceptedFile[0];
    if (!isSupportedImageType(file.type)) {
      return toast.error(
        "Unsupported format. Only JPEG, PNG, GIF, and WEBP files are supported."
      );
    }

    if (file.size > 4.5 * 1024 * 1024) {
      return toast.error("Image too large, maximum file size is 4.5MB.");
    }

    const base64 = await toBase64(file);
    // roughly 4.5MB in base64
    if (base64.length > 6_464_471) {
      return toast.error("Image too large, maximum file size is 4.5MB.");
    }

    setBlobURL(URL.createObjectURL(file));
    setFinished(false);
    complete(base64);
  };

  const [description, text] = completion.split("▲");

  const copy = () => {
    navigator.clipboard.writeText([description, text].join("\n"));
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <DropzoneComponent disabled={isLoading} onDrop={onDrop}>
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
          return (
            <div
              {...getRootProps()}
              className={clsx(
                "h-[396px] object-cover relative group select-none grow w-full my-10 flex justify-center items-center p-5 border border-dashed rounded-lg text-center cursor-pointer",
                isDragActive
                  ? "bg-[#035ffe] text-white animate-pulse"
                  : "bg-slate-100/50 text-slate-400",
                isLoading && "cursor-not-allowed"
              )}
            >
              <input
                {...getInputProps({
                  multiple: false,
                  accept: "image/jpeg, image/png, image/gif, image/webp",
                })}
              />
              {blobURL ? (
                <Image
                  src={blobURL}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
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
          );
        }}
      </DropzoneComponent>
      {(isLoading || completion) && (
        <div className="space-y-3 basis-1/2 p-3 rounded-md bg-gray-100 w-full drop-shadow-sm">
          <Section
            heading="Description"
            finished={finished}
            content={description}
          />
          <Section heading="Text" finished={finished} content={text} />
          {finished && text && (
            <button
              onClick={copy}
              className="w-full p-1 lg:w-auto rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <CopyIcon className="size-4" /> Copy All
            </button>
          )}
        </div>
      )}
    </>
  );
}

function Section({
  heading,
  content,
  finished,
}: {
  heading: string;
  content: string;
  finished: boolean;
}) {
  function copy() {
    navigator.clipboard.writeText(content || "");
    toast.success("Copied to clipboard");
  }

  const loading = !content && !finished;

  return (
    <>
      {content && (
        <button
          className="float-right rounded-md p-1 hover:bg-gray-200 transition-colors ease-in-out"
          onClick={copy}
          aria-label="Copy to clipboard"
        >
          <CopyIcon className="size-4" />
        </button>
      )}
      <h2 className="font-bold select-none text-gray-900">{heading}</h2>

      {loading && (
        <div className="bg-gray-200 animate-pulse rounded w-full h-6" />
      )}
      {content && (
        <p className="whitespace-pre-line break-words">{content.trim()}</p>
      )}
      {finished && !content && (
        <p className="text-gray-600 select-none">
          No text was found in that image.
        </p>
      )}
    </>
  );
}
