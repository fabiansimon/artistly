'use client';

import { useEffect, useMemo, useState } from 'react';
import ToastController from '@/controllers/ToastController';
import { fetchProject } from '@/lib/api';
import { LocalStorage } from '@/lib/localStorage';
import AudioEditor from '@/components/AudioEditor';
import FeedbackContainer from '@/components/FeedbackContainer';
import { useAudioContext } from '@/providers/AudioProvider';
import VersionControl from '@/components/VersionControl';
import AudioControls from '@/components/AudioControls';
import { useParams } from 'next/navigation';
import AnimatedText from '@/components/AnimatedText';

function ProjectPage() {
  const { version, file, project, setProject, setVersion, setFile } =
    useAudioContext();
  const { id } = useParams();

  const [error, setError] = useState<string | null>(null);

  const { timestampComments, generalComments } = useMemo(() => {
    if (!version) return { timestampComments: [], generalComments: [] };
    const { feedback } = version;
    return {
      timestampComments: feedback.filter((f) => f.timestamp),
      generalComments: feedback.filter((f) => !f.timestamp),
    };
  }, [version]);

  useEffect(() => {
    if (file) return;
    const cachedAudio = LocalStorage.fetchAudioFile();
    setFile(cachedAudio);
  }, [file, setFile]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetchProject(id as string);
        setProject(res);
        setVersion({ ...res.versions[0], index: 1 });
      } catch (error: any) {
        console.error(error.message);
        ToastController.showErrorToast('Something went wrong', error.message);
      }
    })();
  }, [id, setProject, setVersion]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return (
      <div className="flex flex-col flex-grow w-full h-full content-center items-center justify-center">
        <span className="loading loading-ring loading-sm"></span>
        <AnimatedText
          className="mt-2"
          strings={[
            'Fetching Audio',
            'Gathering Data',
            'Searching for new Versions',
          ]}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center flex-grow h-full w-full flex-col fixed py-10">
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
    </div>
  );
}

export default ProjectPage;
