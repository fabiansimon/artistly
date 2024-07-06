import { AudioFile, InputData, InputType } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import {
  Cancel01Icon,
  Mail01Icon,
  MehIcon,
  PencilEdit02Icon,
} from 'hugeicons-react';
import { LocalStorage } from '@/lib/localStorage';
import { REGEX } from '@/constants/regex';
import ToastController from '@/controllers/ToastController';
import { uploadTrack } from '@/lib/api';
import { inputDataEmpty } from '@/types/typeFunc';
import { useRouter } from 'next/navigation';
import AudioPlayer from './AudioPlayer';

export default function ProjectInput({ onClick }: { onClick: () => void }) {
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
    <div className="flex flex-col w-full max-w-screen-md items-center">
      <article className="prose mb-4">
        <h3 className="text-white text-sm text-center">Create Project</h3>
      </article>
      <div className="flex flex-grow flex-col justify-center rounded-xl items-center space-y-4 w-full">
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
            placeholder="Name of song/project"
            value={inputData.title}
          />
        </label>

        <textarea
          value={inputData.description}
          onInput={({ currentTarget: { value } }) =>
            handleInput(InputType.DESCRIPTION, value)
          }
          className="textarea text-sm textarea-bordered bg-transparent w-full max-h-44"
          placeholder="Add some project notes (optional)"
        ></textarea>

        <AudioPlayer className="py-4" />

        <div className="w-full flex flex-col space-y-1">
          <article className="prose text-left text-white">
            <p className="text-white/80 text-sm">{'Invite collaborators'}</p>
          </article>
          {inputData.emailList.size > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Array.from(inputData.emailList).map((email, index) => (
                <CollaboratorContainer
                  key={index}
                  email={email}
                  onDelete={() => removeEmail(email)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-[5.5px]">
              <MehIcon
                size={14}
                className="text-white/40"
              />
              <article>
                <p className="prose-sm text-white/40 ">no one added yet</p>
              </article>
            </div>
          )}
        </div>

        <div className="flex gap-4 w-full flex-col md:flex-row">
          <label className="input input-bordered bg-transparent flex items-center gap-2 flex-grow">
            <Mail01Icon size={16} />
            <input
              onInput={({ currentTarget: { value } }) =>
                handleInput(InputType.EMAIL, value)
              }
              value={inputData.email}
              type="text"
              className="grow text-sm bg-transparent"
              placeholder="Email"
            />
          </label>
          <button
            disabled={inputData.email.trim().length === 0}
            onClick={() => handleInput(InputType.ADD_EMAIL)}
            className="btn btn-outline btn-primary text-white flex-grow"
          >
            {'Add Collborator'}
          </button>
        </div>
      </div>

      <button
        disabled={!inputValid}
        onClick={handleSubmit}
        className="btn btn-active btn-primary text-white mt-4 w-full"
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <article className="prose text-white">
            <p>{'Create'}</p>
          </article>
        )}
      </button>
    </div>
  );
}

function CollaboratorContainer({
  email,
  onDelete,
}: {
  email: string;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onDelete}
      className="flex cursor-pointer bg-primary/10 rounded-md px-2 py-1 items-center space-x-2"
    >
      <article className="prose">
        <p className="prose-sm text-white/70">{email}</p>
      </article>
      <Cancel01Icon size={16} />
    </div>
  );
}
