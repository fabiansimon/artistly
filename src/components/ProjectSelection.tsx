import { Project } from '@/types';

export default function ProjectSelection({
  projects,
  onInput,
}: {
  projects: Project[];
  onInput: (input?: string) => void;
}) {
  return (
    <>
      <div
        onClick={() => onInput()}
        className="flex flex-grow items-center justify-center w-full hover:bg-neutral-950/50 rounded-lg p-2 -m-2 cursor-pointer"
      >
        <article className="prose text-center">
          <h3 className="text-white text-sm">{'Create a new project'}</h3>
          <p className="text-white/70 text-sm">
            {
              'Choose this option if this is your first draft/version that you want to share.'
            }
          </p>
        </article>
      </div>
      <div className="border-l border-neutral-800/80 mx-4 w-1 min-h-full flex" />
      <div className="flex flex-col mt-4 flex-grow items-center justify-center w-full">
        <article className="prose text-center">
          <h3 className="text-white text-sm">{'Add to exisiting project'}</h3>
          <p className="text-white/70 text-sm">
            {'Upload this version to an exisiting project.'}
          </p>
        </article>
        <select
          onChange={(e) => onInput(e.target.value)}
          className="select text-xs text-center select-sm select-bordered bg-transparent w-full mt-4"
        >
          <option
            disabled
            selected
          >
            Chose a project
          </option>
          {projects.map(({ id, title }) => (
            <option
              key={id}
              value={id}
            >
              {title}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
