import { EditProjectInput, InputType, ProjectInputData } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { Mail01Icon, PencilEdit02Icon } from 'hugeicons-react';
import { REGEX } from '@/constants/regex';
import ToastController from '@/controllers/ToastController';
import { useProjectContext } from '@/providers/ProjectProvider';

export default function EditProjectDialog({}: {}) {
  const { project } = useProjectContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [inputData, setInputData] = useState<EditProjectInput | null>();

  const handleError = (title: string, description?: string) => {
    ToastController.showErrorToast(title, description);
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

  useEffect(() => {
    if (!project) return;
    const {
      authors,
      collaborators,
      created_at,
      creator_id,
      description,
      id,
      title,
      versions,
    } = project;

    setInputData({
      authors,
      collaborators,
      description,
      invites,
      title,
      versions,
    });
  }, [project]);

  if (!project) return;

  return (
    <div className="flex flex-col w-full max-w-screen-md items-center">
      <article className="prose mb-4">
        <h3 className="text-white text-sm text-center">Edit Project</h3>
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
