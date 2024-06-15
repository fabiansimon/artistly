import { AudioFile, InputData, inputDataEmpty, InputType } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import WaveContainer from './WaveContainer';
import {
  Cancel01Icon,
  Mail01Icon,
  PencilEdit01Icon,
  PencilEdit02Icon,
} from 'hugeicons-react';
import { LocalStorage } from '@/lib/localStorage';
import { REGEX } from '@/constants/regex';
import ToastController from '@/controllers/ToastController';
import AudioPlayer from './AudioPlayer';

export default function ShareContainer({
  audioFile,
}: {
  audioFile?: AudioFile;
}) {
  const [inputData, setInputData] = useState<InputData>({
    title: audioFile?.name || '',
    description: '',
    emailList: new Set<string>(),
    email: '',
  });

  const inputValid = useMemo(() => {
    return true;
  }, []);

  useEffect(() => {
    const cachedInput = LocalStorage.fetchInputData();
    if (cachedInput) setInputData(cachedInput);
  }, []);

  useEffect(() => {
    if (inputDataEmpty(inputData)) return;
    LocalStorage.saveInputData(inputData);
  }, [inputData]);

  if (audioFile === undefined)
    return <span className="loading loading-ring loading-sm"></span>;

  const handleError = (title: string, description?: string) => {
    ToastController.showErrorToast(title, description);
  };

  const removeEmail = (email: string) => {
    setInputData((prev) => {
      const list = prev.emailList;
      list.delete(email);
      return {
        ...prev,
        emailList: list,
      };
    });
  };

  const handleInput = (type: InputType, value?: string) => {
    setInputData((prev) => {
      switch (type) {
        case InputType.ADD_EMAIL:
          const input = prev.email;
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
  const { intervalPeaks } = audioFile;
  return (
    <div className="w-[80%] flex flex-col items-center">
      <article className="prose mb-4">
        <h3 className="">Upload Track</h3>
      </article>
      <div className="flex flex-col w-full justify-center bg-neutral rounded-xl items-center space-y-4 px-4 py-4">
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
            className="grow max-w-xs bg-transparent text-center"
            placeholder="Title"
            value={inputData.title}
          />
        </label>

        <AudioPlayer
          className="py-4"
          audioFile={audioFile}
        />

        <div className="w-full flex flex-col space-y-1">
          <article className="prose text-left">
            <p>{'Share with'}</p>
          </article>
          <div className="flex flex-wrap gap-2">
            {Array.from(inputData.emailList).map((email, index) => (
              <CollaboratorContainer
                key={index}
                email={email}
                onDelete={() => removeEmail(email)}
              />
            ))}
          </div>
        </div>

        <div className="flex space-x-4 w-full">
          <label className="input input-bordered flex items-center gap-2 flex-grow">
            <Mail01Icon size={18} />
            <input
              onInput={({ currentTarget: { value } }) =>
                handleInput(InputType.EMAIL, value)
              }
              value={inputData.email}
              type="text"
              className="grow"
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
        onClick={() => console.log('called')}
        className="btn btn-active btn-primary text-white mt-4 w-full"
      >
        {'Share'}
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
      className="flex bg-primary/10 rounded-md px-2 py-1 items-center space-x-2"
    >
      <article className="prose">
        <p className="prose-sm">{email}</p>
      </article>
      <Cancel01Icon size={16} />
    </div>
  );
}
