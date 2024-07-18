import { EditProjectInput, InputType, Project } from '@/types';
import { useEffect, useState } from 'react';
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Delete01Icon,
  FileEditIcon,
  PencilEdit02Icon,
  RestoreBinIcon,
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
      return Math.min(project.versions.length - 1, step + 1);
    });
  };

  const handleRemoveVersion = () => {
    setInputData((prev) => {
      if (!prev) return;
      return {
        ...prev,
        versions: prev.versions.map((v, i) => {
          if (i === versionIndex)
            return {
              ...v,
              remove: !v.remove,
            };

          return v;
        }),
      };
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
      versions: versions.map((v) => ({ ...v, remove: false })),
    });
  }, [project]);

  if (!project || !inputData) return;
  const currentVersion = inputData.versions[versionIndex];

  return (
    <div className="flex flex-col w-full max-w-screen-md items-center space-y-4">
      <article className="prose">
        <h3 className="text-white text-sm text-center">Edit Project</h3>
      </article>

      {/* Title & Description */}
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
          className="textarea text-xs textarea-bordered bg-transparent w-full max-h-44 text-white/70"
          placeholder="Update project notes (optional)"
        ></textarea>
      </div>
      {/*  */}

      {/* Versions */}
      <div className="flex flex-col items-center border rounded-lg bg-neutral-950 border-white/10 px-2 py-4 space-y-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleVersionChange(-1)}
            className={cn(
              'flex bg-neutral-900 hover:bg-neutral-800 border rounded-full border-white/10 items-center justify-center min-h-8 min-w-8',
              versionIndex === 0 && 'opacity-0'
            )}
          >
            <ArrowLeft02Icon size={12} />
          </button>

          {/* Edit Versions Container */}
          <div
            className={cn(
              'border relative overflow-hidden bg-neutral-900 border-white/10 rounded-lg p-2 flex justify-center flex-col items-center px-2',
              currentVersion.remove && 'border-error/60'
            )}
          >
            {currentVersion.remove && (
              <div
                onClick={handleRemoveVersion}
                className="absolute cursor-pointer bg-red-900/10 overflow-hidden rounded-lg w-full h-full backdrop-blur-md flex items-center justify-center"
              >
                <div className="flex space-x-2 items-center">
                  <RestoreBinIcon
                    className="text-white"
                    size={16}
                  />
                  <p className="text-xs font-medium text-white">
                    click to undo
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-between w-full">
              <p className="prose ml-2 text-white/70 text-xs font-medium text-center">
                Edit Version
              </p>
              <button
                onClick={handleRemoveVersion}
                className="-my-1 hover:bg-neutral-800 rounded-full px-2 flex items-center space-x-1"
              >
                <p className="prose text-error/60 text-[11px] font-medium text-center">
                  Remove
                </p>
                <Delete01Icon
                  size={12}
                  className="text-error/60"
                />
              </button>
            </div>
            <div className="divider my-0" />
            <div className="flex space-x-2">
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
                  className="input bg-transparent text-xs input-sm w-full max-w-xs placeholder-white/70"
                  placeholder="update version notes"
                  value={inputData.versions[versionIndex].notes}
                />
              </div>
              <button className="flex hover:bg-neutral-800 items-center border border-white/10 flex-col p-2 rounded-md space-y-1">
                <FileEditIcon
                  size={18}
                  className="text-white mt-1"
                />
                <p className="prose text-[11px] text-white/70 font-medium">
                  replace
                </p>
              </button>
            </div>
          </div>
          {/*  */}

          <button
            onClick={() => handleVersionChange(1)}
            className={cn(
              'flex bg-neutral-900 hover:bg-neutral-800 border rounded-full border-white/10 items-center justify-center min-h-8 min-w-8',
              versionIndex === project.versions.length - 1 && 'opacity-0'
            )}
          >
            <ArrowRight02Icon size={12} />
          </button>
        </div>
        <div className="flex space-x-1">
          {inputData.versions.map((v, i) => (
            <div
              className={cn(
                'min-w-[6px] min-h-[6px] bg-neutral-400 rounded-full',
                v.remove && 'bg-error/60',
                versionIndex !== i && 'opacity-25'
              )}
              key={i}
            />
          ))}
        </div>
      </div>
      {/*  */}

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
