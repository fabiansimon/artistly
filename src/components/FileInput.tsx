import { ChangeEvent } from 'react';

export default function FileInput({
  onFile,
}: {
  onFile: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex mx-auto items-center flex-col">
      <article className="prose text-center">
        <h3 className="text-white text-sm">{'Import your masterpiece'}</h3>
        <p className="-mt-2 text-white/60 text-sm">
          {"We will handle it with care, don't worry"}
        </p>
      </article>
      <input
        type="file"
        onChange={onFile}
        className="file-input text-white file-input-bordered scale-90  w-full max-w-xs mt-4 bg-neutral-900"
      />
    </div>
  );
}
