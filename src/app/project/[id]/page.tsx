'use client';

import { useEffect, useMemo } from 'react';
import { useAudioContext } from '@/providers/AudioProvider';
import { useParams } from 'next/navigation';
import Container from '@/components/Container';
import LoadingView from '@/components/LoadingView';
import {
  Add01Icon,
  AddTeamIcon,
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  Download04Icon,
  InformationCircleIcon,
  Notebook02Icon,
  PencilEdit02Icon,
  Rocket01Icon,
  Share01Icon,
} from 'hugeicons-react';
import AudioEditor from '@/components/AudioEditor';
import FeedbackContainer from '@/components/FeedbackContainer';
import { MenuOption, Project, UsageLimit } from '@/types';
import SimpleButton from '@/components/SimpleButton';
import { checkUserCapacity, cn } from '@/lib/utils';
import UploadContainer from '@/components/UploadContainer';
import DownloadDialog from '@/components/DownloadDialog';
import { useUserContext } from '@/providers/UserProvider';
import InviteDialog from '@/components/InviteDialog';
import CollaboratorContainer from '@/components/CollaboratorContainer';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { useProjectContext } from '@/providers/ProjectProvider';
import PremiumDialog from '@/components/PremiumDialog';
import EditProjectDialog from '@/components/EditProjectDialog';
import ModalController from '@/controllers/ModalController';
import VersionControl from '@/components/VersionControl';
import ShareDialog from '@/components/ShareDialog';

function ProjectPage() {
  const {
    project: { fetch, data: project, isLoading },
  } = useDataLayerContext();
  const { isAuthor } = useProjectContext();
  const { file } = useAudioContext();
  const { version, handleVersionChange } = useProjectContext();

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
    fetch({ id });
  }, [id, fetch]);

  useEffect(() => {
    if (!project?.versions?.length) return;
    handleVersionChange(project.versions[0].id);
  }, [project]);

  if (isLoading || !project)
    return (
      <LoadingView
        strings={[
          'Fetching Audio',
          'Gathering Data',
          'Searching for new Versions',
        ]}
      />
    );

  const empty = !file || !version;

  return (
    <Container
      omitPadding
      className="max-w-screen-lg mx-auto"
    >
      <div className="flex flex-col space-y-3 flex-grow max-h-screen">
        <div className="flex w-full justify-between px-4">
          <div className="grow">
            <div className="grow flex justify-between w-full relative">
              <h3 className="text-md text-white font-medium">
                {project.title}
              </h3>
              <CollaboratorContainer className="absolute right-0 bottom-2" />
            </div>

            <ProjectOptions
              author={isAuthor}
              project={project}
              className="mt-2"
            />

            <div className="flex mt-2 space-x-2">
              <div className="flex w-full space-x-2 min-h-20">
                <div className="border w-[40%] border-white/10 rounded-md p-2 space-y-2">
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
                    <p className="text-xs text-white mr-10">
                      {version?.notes || 'Nothing added'}
                    </p>
                  </div>
                </div>
                <div className="border border-white/10 rounded-md p-2 space-y-2 w-full">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <InformationCircleIcon
                        size={13}
                        className="text-white/60"
                      />
                      <p className="text-[11px] text-white/60">
                        {'Project Information'}
                      </p>
                    </div>
                    <p className="text-xs text-white mr-10">
                      {project.description || 'Nothing added'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider my-0" />

        {empty && (
          <div className="flex flex-col items-center h-full justify-center -translate-y-12">
            <article className="prose text-center">
              <h3 className="text-white text-[16px]">
                No version updated yet.
              </h3>
              <p className="text-white/70 -mt-2 text-xs">
                Make sure to upload your first version before inviting
                collaborators.
              </p>
            </article>
            <button
              onClick={() =>
                ModalController.show(
                  <UploadContainer projectId={id as string} />
                )
              }
              className="btn btn-primary text-white mx-auto mt-4"
            >
              <Rocket01Icon size={18} />
              Upload First Draft
            </button>
          </div>
        )}
        {!empty && (
          <FeedbackContainer
            className="mx-4"
            generalComments={generalComments}
            timestampComments={timestampComments}
          />
        )}

        {!empty && (
          <div className="flex flex-col items-center w-full space-y-2">
            <AudioEditor comments={timestampComments} />
          </div>
        )}
      </div>
    </Container>
  );
}

function ProjectOptions({
  project,
  author,
  className,
}: {
  author: boolean;
  project: Project;
  className?: string;
}) {
  const { user } = useUserContext();
  const handleAddVersion = () => {
    const { id } = project;
    if (!checkUserCapacity({ user, check: UsageLimit.versions, project }))
      return ModalController.show(
        <PremiumDialog usageLimit={UsageLimit.versions} />
      );

    ModalController.show(<UploadContainer projectId={id} />);
  };

  const options: MenuOption[] = useMemo(
    () => [
      {
        text: 'Edit',
        icon: <PencilEdit02Icon size={16} />,
        onClick: () => ModalController.show(<EditProjectDialog />),
        ignore: !author,
      },
      {
        text: 'Share',
        icon: <Share01Icon size={16} />,
        onClick: () => ModalController.show(<ShareDialog />),
      },
      {
        text: 'Invite',
        icon: <AddTeamIcon size={16} />,
        onClick: () => ModalController.show(<InviteDialog />),
        ignore: !author,
      },
      {
        text: 'Download',
        icon: <Download04Icon size={16} />,
        onClick: () => ModalController.show(<DownloadDialog />),
      },
    ],
    [author]
  );

  return (
    <div className={cn('flex justify-between', className)}>
      <div className="flex space-x-1">
        {options.map(({ text, icon, onClick, ignore }, index) => {
          if (ignore) return;
          return (
            <SimpleButton
              iconPosition="left"
              condensed
              key={index}
              icon={icon}
              text={text}
              onClick={onClick}
            />
          );
        })}
      </div>
      <div className="flex space-x-2">
        {author && (
          <SimpleButton
            iconPosition="left"
            condensed
            icon={
              <Add01Icon
                size={16}
                className="text-white"
              />
            }
            text={'add version'}
            onClick={handleAddVersion}
          />
        )}
        <VersionControl />
      </div>
    </div>
  );
}

export default ProjectPage;
