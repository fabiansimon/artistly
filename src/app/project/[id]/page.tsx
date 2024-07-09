'use client';

import { useEffect, useMemo } from 'react';
import { fetchProject } from '@/lib/api';
import { useAudioContext } from '@/providers/AudioProvider';
import { useParams } from 'next/navigation';
import Container from '@/components/Container';
import LoadingView from '@/components/LoadingView';
import {
  Add01Icon,
  AddTeamIcon,
  Download04Icon,
  InformationCircleIcon,
  Notebook02Icon,
  PencilEdit02Icon,
  Share01Icon,
} from 'hugeicons-react';
import AudioEditor from '@/components/AudioEditor';
import FeedbackContainer from '@/components/FeedbackContainer';
import { MenuOption } from '@/types';
import SimpleButton from '@/components/SimpleButton';
import { cn } from '@/lib/utils';
import DialogController from '@/controllers/DialogController';
import UploadContainer from '@/components/UploadContainer';
import DownloadDialog from '@/components/DownloadDialog';

function ProjectPage() {
  const { version, file, project, setProject, setVersion } = useAudioContext();

  const { id } = useParams();

  const { timestampComments, generalComments } = useMemo(() => {
    if (!version?.feedback)
      return { timestampComments: [], generalComments: [] };
    const { feedback } = version;
    return {
      timestampComments: feedback.filter((f) => f.timestamp),
      generalComments: feedback.filter((f) => !f.timestamp),
    };
  }, [version]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetchProject(id as string);
        setProject(res);
        setVersion({ ...res.versions[0], index: 0 });
      } catch (error) {
        console.error(error.message);
      }
    })();
  }, [id, setProject, setVersion]);

  const empty = !project || !version || !file;

  if (empty)
    return (
      <LoadingView
        strings={[
          'Fetching Audio',
          'Gathering Data',
          'Searching for new Versions',
        ]}
      />
    );

  const author = project.creator_id === '4f0f6512-2b24-4d15-a058-8af776af0409';
  return (
    <Container
      omitPadding
      className="max-w-screen-lg mx-auto"
    >
      <div className="flex flex-col space-y-3 flex-grow max-h-screen">
        <div className="flex w-full justify-between px-4">
          <div className="grow">
            <div
              className={cn(
                'flex items-center space-x-2',
                author && 'cursor-pointer'
              )}
            >
              <h3 className="text-md text-white font-medium">
                {project.title}
              </h3>
              {author && <PencilEdit02Icon size={14} />}
            </div>

            <ProjectOptions
              author={author}
              projectId={project.id}
              className="mt-2"
            />

            <div className="flex w-full mt-2 space-x-2">
              <div className="border border-white/10 rounded-md p-2 space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Notebook02Icon
                      size={13}
                      className="text-white/60"
                    />
                    <p className="text-[11px] text-white/60 text-white">
                      {'Version notes'}
                    </p>
                  </div>
                  <p className="text-xs text-white/50 text-white mr-10">
                    {version.notes || 'Nothing added'}
                  </p>
                </div>
              </div>
              <div className="border border-white/10 rounded-md p-2 space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <InformationCircleIcon
                      size={13}
                      className="text-white/60"
                    />
                    <p className="text-[11px] text-white/60 text-white">
                      {'Project Information'}
                    </p>
                  </div>
                  <p className="text-xs text-white/50 text-white mr-10">
                    {project.description || 'Nothing added'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider my-0" />
        <FeedbackContainer
          className="mx-4"
          generalComments={generalComments}
          timestampComments={timestampComments}
        />

        <div className="flex flex-col items-center w-full space-y-2">
          <AudioEditor comments={timestampComments} />
        </div>
      </div>
    </Container>
  );
}

function ProjectOptions({
  projectId,
  author,
  className,
}: {
  author: boolean;
  projectId: string;
  className?: string;
}) {
  const handleAddVersion = () => {
    DialogController.showCustomDialog(
      <UploadContainer projectId={projectId} />
    );
  };

  const options: MenuOption[] = useMemo(
    () => [
      {
        text: 'Share',
        icon: <Share01Icon size={16} />,
        onClick: () => console.log('hello'),
      },
      {
        text: 'Invite',
        icon: <AddTeamIcon size={16} />,
        onClick: () => console.log('hello'),
      },
      {
        text: 'Download',
        icon: <Download04Icon size={16} />,
        onClick: () => DialogController.showCustomDialog(<DownloadDialog />),
      },
    ],
    []
  );
  return (
    <div className={cn('flex justify-between', className)}>
      <div className="flex space-x-2">
        {options.map(({ text, icon, onClick }, index) => (
          <SimpleButton
            iconPosition="left"
            condensed
            key={index}
            icon={icon}
            text={text}
            onClick={onClick}
          />
        ))}
      </div>
      {author && (
        <SimpleButton
          icon={
            <Add01Icon
              size={16}
              className="text-white"
            />
          }
          onClick={handleAddVersion}
          className="bg-primary hover:bg-primary-400"
          textClassName="text-white font-medium"
          iconPosition="left"
          condensed
          text={'new version'}
        />
      )}
    </div>
  );
}

export default ProjectPage;
