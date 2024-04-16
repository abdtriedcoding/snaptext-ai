"use client";

import clsx from "clsx";
import { useState } from "react";
import DropzoneComponent from "react-dropzone";

export default function ImageDropzone() {
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles || loading) return;
    const firstFile = acceptedFiles[0];
    console.log(firstFile);
  };

  return (
    <DropzoneComponent disabled={loading} onDrop={onDrop}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
        return (
          <>
            <div
              {...getRootProps()}
              className={clsx(
                "max-w-[708px] w-full mt-10 h-64 flex justify-center items-center p-5 border border-dashed rounded-lg text-center cursor-pointer",
                isDragActive
                  ? "bg-[#035ffe] text-white animate-pulse"
                  : "bg-slate-100/50 dark:bg-slate=800/80 text-slate-400",
                loading && "cursor-not-allowed"
              )}
            >
              <input {...getInputProps({ multiple: false })} />
              {!isDragActive && "Click here or drop a file to upload"}
              {isDragActive && !isDragReject && "Drop to upload this file!"}
              {isDragReject && "File type not accepted, sorry!!"}
            </div>
          </>
        );
      }}
    </DropzoneComponent>
  );
}
