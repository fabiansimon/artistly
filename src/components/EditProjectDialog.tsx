import { EditProjectInput, InputType, Project } from '@/types';
import { useEffect, useState } from 'react';
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Delete01Icon,
  FileEditIcon,
  PencilEdit02Icon,
  RestoreBinIcon,
  TimeScheduleIcon,
} from 'hugeicons-react';
import ToastController from '@/controllers/ToastController';
import { _, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import CollaboratorChip from './CollaboratorChip';
import AlertController from '@/controllers/AlertController';
import { useProjectContext } from '@/providers/ProjectProvider';

export default function EditProjectDialog() {
  const { project, removeInvite } = useProjectContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [inputData, setInputData] = useState<EditProjectInput | null>();
  const [versionIndex, setVersionIndex] = useState<number>(0);

  const handleError = (title: string, description?: string) => {
    ToastController.showErrorToast(title, description);
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

  const handleSubmit = () => {
    AlertController.show({
      title: 'Is everything correct?',
      description: 'Once updated it cannot be reverted.',
      callback: async () => await handleUpdate(),
      buttonText: 'Update',
    });
  };

  const handleUpdate = async () => {
    console.log(inputData);
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
      if (!prev) return;
      switch (type) {
        case InputType.TITLE:
          return { ...prev, title: value ?? '' };

        case InputType.DESCRIPTION:
          return { ...prev, description: value ?? '' };

        case InputType.VERSION_TITLE:
          return {
            ...prev,
            versions: prev.versions.map((v, i) =>
              i === versionIndex ? { ...v, title: value } : v
            ),
          };

        case InputType.VERSION_DESCRIPTION:
          return {
            ...prev,
            versions: prev.versions.map((v, i) =>
              i === versionIndex ? { ...v, notes: value } : v
            ),
          };

        default:
          return prev;
      }
    });
  };

  const currentVersion = inputData.versions[versionIndex];
  const baseClass = 'bg-neutral-950/50 shadow shadow-black/10';

  return (
    <div className="flex flex-col w-full max-w-screen-md items-center space-y-3">
      <article className="prose">
        <h3 className="text-white text-sm text-center">Edit Project</h3>
      </article>

      {/* Title & Description */}
      <div
        className={
          'flex flex-grow flex-col justify-center rounded-xl items-center space-y-4 w-full'
        }
      >
        <label
          className={cn(
            'input input-bordered flex items-center justify-center gap-2 w-full relative -mb-2',
            baseClass
          )}
        >
          <PencilEdit02Icon
            size={18}
            className="absolute left-4"
          />
          <input
            onInput={({ currentTarget: { value } }) =>
              handleInput(InputType.TITLE, value)
            }
            type="text"
            className="grow text-sm text-center placeholder-white/60"
            placeholder="Name of song/project"
            value={inputData.title}
          />
        </label>

        <textarea
          value={inputData.description}
          onInput={({ currentTarget: { value } }) =>
            handleInput(InputType.DESCRIPTION, value)
          }
          className={cn(
            'textarea text-xs textarea-bordered w-full max-h-44 text-white/70',
            baseClass
          )}
          placeholder="Update project notes (optional)"
        ></textarea>
      </div>
      {/*  */}

      {/* Versions */}
      <div
        className={cn(
          'flex flex-col items-center border rounded-lg border-white/10 px-2 py-4 space-y-3',
          baseClass
        )}
      >
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
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
              </motion.div>
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
                  className="input bg-transparent text-xs input-sm w-full max-w-xs placeholder-white/60 text-white/70"
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

      {/* Invite Container */}
      <div
        className={cn(
          'flex flex-col w-full items-center border rounded-lg border-white/10 p-2',
          baseClass
        )}
      >
        <div className="flex items-center space-x-2">
          <TimeScheduleIcon size={12} />
          <p className="prose text-white/70 text-xs font-medium text-center">
            Outstanding invites
          </p>
        </div>
        <div className="divider my-0" />
        <div className="flex flex-wrap items-center justify-center gap-2">
          {!inputData.openInvites.length && (
            <p className="prose text-white/40 text-xs">No invites</p>
          )}
          {inputData.openInvites.map(({ email, id }) => (
            <CollaboratorChip
              key={id}
              email={email}
              onDelete={() =>
                AlertController.show({
                  callback: () => removeInvite(id),
                })
              }
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="btn btn-active btn-primary text-white mt-4 w-full"
      >
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
