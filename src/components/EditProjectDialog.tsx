import {
  EditProjectInput,
  InputType,
  Project,
  ProjectInputData,
} from '@/types';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Mail01Icon,
  PencilEdit02Icon,
  TimeScheduleIcon,
} from 'hugeicons-react';
import { REGEX } from '@/constants/regex';
import ToastController from '@/controllers/ToastController';
import { cn } from '@/lib/utils';

export default function EditProjectDialog({ project }: { project: Project }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputData, setInputData] = useState<EditProjectInput | null>();
  const [versionIndex, setVersionIndex] = useState<number>(0);

  const handleError = (title: string, description?: string) => {
    ToastController.showErrorToast(title, description);
  };

  const handleVersionChange = (step: number) => {
    setVersionIndex((prev) => {
      if (step < 0) return Math.max(0, prev - 1);

      return Math.min(project.versions.length - 1, prev + 1);
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

  useEffect(() => {
    if (!project) return;
    const {
      authors,
      collaborators,
      openInvites,
      description,
      title,
      versions,
    } = project;

    setInputData({
      authors,
      openInvites,
      collaborators,
      description,
      title,
      versions,
    });
  }, [project]);

  if (!project || !inputData) return;

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
          placeholder="Update project notes (optional)"
        ></textarea>
      </div>

      <div className="flex items-end space-x-2 w-full">
        <button
          onClick={() => handleVersionChange(-1)}
          className={cn(
            'flex hover:bg-neutral-950 border mb-8 rounded-full border-white/10 items-center justify-center h-8 w-8',
            versionIndex === 0 && 'opacity-0'
          )}
        >
          {<ArrowLeft02Icon size={12} />}
        </button>
        <div className="border border-white/10 rounded-lg p-2 mt-4 flex justify-center flex-col items-center">
          <div className="flex items-center space-x-2">
            <TimeScheduleIcon size={12} />
            <p className="prose text-white/70 text-xs font-medium text-center">
              Edit Versions
            </p>
          </div>
          <div className="divider my-0" />
          <div>
            <input
              onInput={({ currentTarget: { value } }) =>
                handleInput(InputType.VERSION_TITLE, value)
              }
              type="text"
              className="input bg-transparent text-xs input-sm w-full max-w-xs"
              placeholder="Name of Version"
              value={inputData.versions[versionIndex].title}
            />
            <input
              onInput={({ currentTarget: { value } }) =>
                handleInput(InputType.VERSION_DESCRIPTION, value)
              }
              type="text"
              className="input bg-transparent text-xs input-sm w-full max-w-xs"
              placeholder="update version notes"
              value={inputData.versions[versionIndex].notes}
            />
          </div>
        </div>

        <button
          onClick={() => handleVersionChange(1)}
          className={cn(
            'flex hover:bg-neutral-950 border mb-8 rounded-full border-white/10 items-center justify-center h-8 w-8',
            versionIndex === project.versions.length - 1 && 'opacity-0'
          )}
        >
          {<ArrowRight02Icon size={12} />}
        </button>
      </div>

      <button className="btn btn-active btn-primary text-white mt-4 w-full">
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <article className="prose text-white">
            <p>{'Update'}</p>
          </article>
        )}
      </button>
    </div>
  );
}
