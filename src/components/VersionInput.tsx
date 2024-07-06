import { AudioFile, InputData, InputType } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { PencilEdit02Icon } from 'hugeicons-react';
import { LocalStorage } from '@/lib/localStorage';
import { REGEX } from '@/constants/regex';
import ToastController from '@/controllers/ToastController';
import { uploadTrack } from '@/lib/api';
import { inputDataEmpty } from '@/types/typeFunc';
import { useRouter } from 'next/navigation';
import { PlayButton } from './PlayButton';

export default function VersionInput() {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputData, setInputData] = useState<InputData>({
    file: undefined,
    title: '',
    description: '',
    emailList: new Set<string>(),
    email: '',
  });

  const router = useRouter();

  const inputValid = useMemo(() => {
    const { title, emailList } = inputData;
    return !(
      !inputData?.file ||
      title.trim().length === 0 ||
      emailList.size === 0
    );
  }, [inputData]);

  // useEffect(() => {
  //   if (!audioFile) return;
  //   const { name: title, file } = audioFile;
  //   setInputData((prev) => ({ ...prev, file, title }));
  // }, [audioFile]);

  useEffect(() => {
    const cachedInput = LocalStorage.fetchInputData();
    if (cachedInput)
      setInputData((prev) => ({ ...cachedInput, file: prev.file }));
  }, []);

  useEffect(() => {
    if (inputDataEmpty(inputData)) return;
    LocalStorage.saveInputData(inputData);
  }, [inputData]);

  const handleSubmit = async () => {
    if (!inputValid) return;
    setLoading(true);

    const { title, description, emailList, file } = inputData;

    const form = new FormData();
    form.append('title', title);
    form.append('feedbackNotes', description);
    form.append('emailList', JSON.stringify(Array.from(emailList)));
    form.append('tracks', file!);

    /*
      DEBUG PURPOSES
      */

    try {
      const res = await uploadTrack(form);
      router.push(`/project/${res.project.id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (title: string, description?: string) => {
    ToastController.showErrorToast(title, description);
  };

  const removeEmail = (email: string) => {
    setInputData((prev) => {
      const list = prev.emailList;
      list.delete(email);
      const newInput = {
        ...prev,
        emailList: list,
      };

      LocalStorage.saveInputData(newInput);
      return newInput;
    });
  };

  const handleInput = (type: InputType, value?: string) => {
    setInputData((prev) => {
      switch (type) {
        case InputType.ADD_EMAIL:
          const input = prev.email.trim();
          if (!REGEX.email.test(input)) {
            handleError('Not a valid email', 'Try again with a valid email.');
            return prev;
          }

          const newEmailList = new Set(prev.emailList);
          newEmailList.add(input);
          return { ...prev, email: '', emailList: newEmailList };
        case InputType.TITLE:
          return { ...prev, title: value ?? '' };
        case InputType.DESCRIPTION:
          return { ...prev, description: value ?? '' };
        case InputType.EMAIL:
          return { ...prev, email: value ?? '' };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="flex flex-col w-full items-center">
      <article className="prose mb-4">
        <h3 className="text-white text-sm text-center">Upload Version</h3>
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
          value={inputData.description}
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
        className="btn btn-active btn-primary text-white mt-4 w-full"
      >
        <article className="prose text-white">
          <p>{'Create'}</p>
        </article>
      </button>
    </div>
  );
}
