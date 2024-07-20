import { AudioFile, InputType, LeanProject, VersionInputData } from '@/types';
import { useMemo, useState } from 'react';
import { PencilEdit02Icon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';
import { PlayButton } from './PlayButton';
import { uploadVersion } from '@/lib/api';
import { route, ROUTES } from '@/constants/routes';
import ModalController from '@/controllers/ModalController';

export default function VersionInput({
  project,
  audioFile,
}: {
  project: LeanProject;
  audioFile: AudioFile;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputData, setInputData] = useState<VersionInputData>({
    title: `v${project.versions.length + 1}`,
    notes: '',
    file: audioFile,
  });

  const router = useRouter();

  const inputValid = useMemo(() => {
    const { title } = inputData;
    return !(title.trim().length === 0);
  }, [inputData]);

  const handleSubmit = async () => {
    if (!inputValid) return;
    setLoading(true);

    const { title, notes, file } = inputData;
    const form = new FormData();
    form.append('title', title);
    form.append('notes', notes);
    form.append('track', file.file);
    form.append('projectId', project.id);

    try {
      await uploadVersion(form);
      router.push(route(ROUTES.project, project.id));
    } finally {
      ModalController.close();
      setLoading(false);
    }
  };

  const handleInput = (type: InputType, value?: string) => {
    setInputData((prev) => {
      switch (type) {
        case InputType.TITLE:
          return { ...prev, title: value ?? '' };
        case InputType.DESCRIPTION:
          return { ...prev, notes: value ?? '' };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="flex flex-col w-full items-center">
      <article className="prose mb-4">
        <h3 className="text-white text-sm text-center">Upload Version</h3>
        <p className="text-white/70 text-sm text-center -mt-2">{`to project "${project.title}"`}</p>
      </article>
      <div className="flex flex-grow flex-col justify-center rounded-xl items-center space-y-4 w-full mb-4">
        <label className="input input-bordered bg-transparent flex items-center  justify-center gap-2 w-full relative">
          <PencilEdit02Icon
            size={18}
            className="absolute left-4"
          />
          <input
            onInput={({ currentTarget: { value } }) =>
              handleInput(InputType.TITLE, value)
            }
            type="text"
            className="grow text-sm max-w-xs bg-transparent text-center"
            placeholder="v1.0"
            value={inputData.title}
          />
        </label>

        <textarea
          value={inputData.notes}
          onInput={({ currentTarget: { value } }) =>
            handleInput(InputType.DESCRIPTION, value)
          }
          className="textarea text-sm textarea-bordered bg-transparent w-full max-h-44"
          placeholder="Add some version notes (optional)"
        ></textarea>
      </div>

      <PlayButton />

      <button
        disabled={!inputValid}
        onClick={handleSubmit}
        className="btn btn-active btn-primary text-white mt-4 w-full"
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <article className="prose text-white">
            <p>{'Upload'}</p>
          </article>
        )}
      </button>
    </div>
  );
}
