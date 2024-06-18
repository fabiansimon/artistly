import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Project } from '@/types';
import { fetchProjectById } from '../controllers/projectController';
import ToastController from '@/controllers/ToastController';
import { fetchProject } from '@/lib/api';

function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetchProject(id as string);
        console.log(res);
      } catch (error: any) {
        console.log(error.message);
        ToastController.showErrorToast(
          'Something went wrong',
          'Please try again later.'
        );
      }
    })();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center flex-grow h-full w-full max-w-screen-xl flex-col">
      <h1>{project.title}</h1>
      <p>Created at: {new Date(project.created_at).toLocaleString()}</p>
      <h2>Versions</h2>
      <h2>Collaborators</h2>
    </div>
  );
}

export default ProjectPage;
