'use client';

import { useEffect, useMemo } from 'react';
import { fetchProject } from '@/lib/api';
import { useAudioContext } from '@/providers/AudioProvider';
import { useParams } from 'next/navigation';
import VersionControl from '@/components/VersionControl';
import AudioControls from '@/components/AudioControls';
import Container from '@/components/Container';
import LoadingView from '@/components/LoadingView';
import {
  AddTeamIcon,
  Download01Icon,
  Download04Icon,
  Notebook02Icon,
  Share01Icon,
} from 'hugeicons-react';
import AudioWave from '@/components/AudioWave';
import AudioInfo from '@/components/AudioInfo';
import CommentsSection from '@/components/CommentsSection';
import { calculateRange, cn } from '@/lib/utils';
import AudioEditor from '@/components/AudioEditor';
import FeedbackContainer, { InputField } from '@/components/FeedbackContainer';
import { MenuOption } from '@/types';
import SimpleButton from '@/components/SimpleButton';

function ProjectPage() {
  const {
    version,
    file,
    project,
    jumpTo,
    setSettings,
    setRange,
    setProject,
    setVersion,
  } = useAudioContext();

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

  return (
    <Container omitPadding>
      <div className="flex flex-col space-y-3 flex-grow max-h-screen">
        <div className="flex w-full justify-between px-4">
          <div className="grow">
            <h3 className="text-md text-white font-medium">{project.title}</h3>
            <ProjectOptions className="mt-2" />
            <div className="border border-white/10 rounded-md p-2 space-y-2 mt-2 max-w-[70%]">
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
                  {version.notes}
                </p>
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

function ProjectOptions({ className }: { className?: string }) {
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
        onClick: () => console.log('hello'),
      },
    ],
    []
  );
  return (
    <div className={cn('flex space-x-2', className)}>
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
  );
}

export default ProjectPage;
