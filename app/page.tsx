import ImageDropzone from "@/components/image-dropzone";

export default function Home() {
  return (
    <>
      <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
        <b>96,434</b> text from image extraced so far
      </p>
      <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
        Extract your text from image using AI
      </h1>
      <ImageDropzone />
    </>
  );
}
