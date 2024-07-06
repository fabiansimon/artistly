'use client';

import { useEffect, useMemo } from 'react';
import { fetchProject } from '@/lib/api';
import { useAudioContext } from '@/providers/AudioProvider';
import { useParams } from 'next/navigation';
import VersionControl from '@/components/VersionControl';
import AudioControls from '@/components/AudioControls';
import Container from '@/components/Container';
import LoadingView from '@/components/LoadingView';
import { Notebook02Icon } from 'hugeicons-react';
import AudioWave from '@/components/AudioWave';
import AudioInfo from '@/components/AudioInfo';
import CommentsSection from '@/components/CommentsSection';
import { calculateRange } from '@/lib/utils';
import AudioEditor from '@/components/AudioEditor';

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
    <Container className="relative w-full">
      <div className="flex w-full justify-between">
        <div className="grow">
          <h3 className="text-md text-white font-medium">{project.title}</h3>
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
      {/* <FeedbackContainer
        generalComments={generalComments}
        timestampComments={timestampComments}
      /> */}
      {/* <FeedbackContainer
        generalComments={generalComments}
        timestampComments={timestampComments}
      /> */}
      <div className="flex rounded-lg bg-black/10 flex-col items-center justify-center space-y-4 px-4 py-2">
        {/* <AudioInfo />
        <AudioWave
          amplifyBy={200}
          className="my-4"
        /> */}
        <AudioEditor
          className="max-w-screen-md"
          comments={timestampComments}
        />
        <AudioControls className="" />
      </div>
      <div className="absolute bottom-6 justify-center flex left-0 right-0">
        <VersionControl />
      </div>
      {/* <>
        <div className="flex items-center w-full space-x-6 px-10 mt-4 justify-center">
          <VersionControl />
          <AudioEditor
            className="max-w-screen-md"
            comments={timestampComments}
          />
          <AudioControls />
        </div>
        <FeedbackContainer
          generalComments={generalComments}
          timestampComments={timestampComments}
        />
      </> */}
    </Container>
  );
}

export default ProjectPage;
