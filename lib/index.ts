import { Metadata } from "next";
type SupportedImageTypes =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp";

export function toBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
  });
}

export function decodeBase64Image(dataString: string) {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  return {
    type: matches?.[1],
    data: matches?.[2],
  };
}

export function isSupportedImageType(
  type: string
): type is SupportedImageTypes {
  return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(type);
}

export function constructMetadata({
  title = "snaptext",
  description = "Transform images into editable text effortlessly.",
  image = "/thumbnail.png",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@abdtriedcoding",
    },
    metadataBase: new URL("https://snaptext.vercel.app"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
