'use client';

import ToastController from '@/controllers/ToastController';
import { fetchProject, getUserProjects } from '@/lib/api';
import { Paginated, Project, Projects, Version } from '@/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

enum MODE {
  projects,
  project,
}

interface ContextData<T> {
  data: T;
  fetch: (args?: any) => Promise<void>;
  isLoading: boolean;
}

type NullableContextData<T> = Omit<ContextData<T>, 'data'> & { data: T | null };

interface DataLayerContextType {
  projects: ContextData<Paginated<Projects>>;
  project: NullableContextData<Project>;
}

const DataLayerContext = createContext<DataLayerContextType | undefined>(
  undefined
);

export default function DataLayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<MODE | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Paginated<Projects>>({
    content: {
      collabs: [],
      authored: [],
    },
    totalElements: 0,
  });

  const load = useCallback(
    async (
      mode: MODE,
      apiCall: () => Promise<any>,
      setData: (data: any) => void
    ) => {
      setIsLoading(mode);
      try {
        const data = await apiCall();
        setData(data);
      } catch (error) {
        console.error(error);
        ToastController.showErrorToast(
          'Something went wrong.',
          'Please try again.'
        );
      } finally {
        setIsLoading(null);
      }
    },
    []
  );

  const loadProjects = useCallback(
    ({ page = 1, limit = 10 } = {}) =>
      load(
        MODE.projects,
        () => getUserProjects({ pagination: { limit, page } }),
        ({ content, totalElements }) => setProjects({ content, totalElements })
      ),
    [load]
  );

  const loadProject = useCallback(
    ({ id }: { id: string }) =>
      load(
        MODE.project,
        () => fetchProject(id),
        (res) => setProject(res)
      ),
    [load]
  );

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const value = {
    projects: {
      data: projects,
      fetch: loadProjects,
      isLoading: isLoading === MODE.projects,
    },
    project: {
      data: project,
      fetch: loadProject,
      isLoading: isLoading === MODE.project,
    },
  };
  return (
    <DataLayerContext.Provider value={value}>
      {children}
    </DataLayerContext.Provider>
  );
}

export function useDataLayerContext() {
  const context = useContext(DataLayerContext);

  if (!context)
    throw new Error(
      'useDataLayerContext must be used within a DataLayerProvider'
    );

  return context;
}
