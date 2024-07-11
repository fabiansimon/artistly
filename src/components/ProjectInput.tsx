import { InputType, LeanProject, ProjectInputData } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { Mail01Icon, MehIcon, PencilEdit02Icon } from 'hugeicons-react';
import { LocalStorage } from '@/lib/localStorage';
import { REGEX } from '@/constants/regex';
import ToastController from '@/controllers/ToastController';
import { inputDataEmpty } from '@/types/typeFunc';
import DialogController from '@/controllers/DialogController';
import { createProject } from '@/lib/api';
import CollaboratorContainer from './CollaboratorContainer';

export default function ProjectInput({
  onSuccess,
}: {
  onSuccess: (data: LeanProject) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputData, setInputData] = useState<ProjectInputData>({
    title: '',
    description: '',
    emailList: new Set<string>(),
    email: '',
  });

  const inputValid = useMemo(() => {
    const { title, emailList } = inputData;
    return !(title.trim().length === 0 || emailList.size === 0);
  }, [inputData]);

  useEffect(() => {
    const cachedInput = LocalStorage.fetchInputData();
    if (cachedInput) setInputData(cachedInput);
  }, []);

  useEffect(() => {
    if (inputDataEmpty(inputData)) return;
    LocalStorage.saveInputData(inputData);
  }, [inputData]);

  const handleSubmit = async () => {
    if (!inputValid) return;
    setLoading(true);

    const { title, description, emailList } = inputData;

    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('invitees', JSON.stringify(Array.from(emailList)));

    try {
      const res = await createProject(form);
      LocalStorage.clearInputData();
      onSuccess({ id: res.project.id, title, versions: [] });
    } catch (error) {
      console.log(error);
      DialogController.closeDialog();
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
