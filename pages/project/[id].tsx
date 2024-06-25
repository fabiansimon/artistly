'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import ToastController from '@/controllers/ToastController';
import { fetchProject, uploadFeeback } from '@/lib/api';
import { LocalStorage } from '@/lib/localStorage';
import AudioEditor from '@/components/AudioEditor';
import FeedbackContainer from '@/components/FeedbackContainer';
import { useAudioContext } from '@/providers/AudioProvider';
import VersionControl from '@/components/VersionControl';

function ProjectPage() {
  const { version, file, project, setProject, setVersion, setFile } =
    useAudioContext();
  const router = useRouter();
  const { id } = router.query;
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
  }, []);

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
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  const { title, versions } = project;

  return (
    <div className="flex items-center flex-grow h-full w-full flex-col fixed py-10">
      <article className="prose text-center text-white/50">
        <h3 className="text-white">{title}</h3>
        <p className="-mt-4">Version {version?.title}</p>
      </article>
      <div className="flex w-full space-x-6 px-10 mt-4 justify-center">
        <VersionControl />
        {file && <AudioEditor comments={timestampComments} />}
      </div>
      {file && (
        <FeedbackContainer
          generalComments={generalComments}
          timestampComments={timestampComments}
        />
      )}
    </div>
  );
}

export default ProjectPage;
