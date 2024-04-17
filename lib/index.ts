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
