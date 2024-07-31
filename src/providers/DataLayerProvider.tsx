'use client';

import ToastController from '@/controllers/ToastController';
import {
  fetchInitSummary,
  fetchInvitations,
  fetchProject,
  getUserProjects,
} from '@/lib/api';
import { InitSummary, Invitation, Paginated, Project, Projects } from '@/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

enum Mode {
  PROJECTS,
  PROJECT,
  SUMMARY,
  INVITES,
}

interface ContextData<T> {
  data: T;
  isLoading: boolean;
  fetch: (args?: any) => Promise<void>;
  update?: (data: T) => void;
}

type NullableContextData<T> = Omit<ContextData<T>, 'data'> & { data: T | null };

interface DataLayerContextType {
  projects: ContextData<Paginated<Projects>>;
  project: NullableContextData<Project>;
  summary: NullableContextData<InitSummary>;
  invites: NullableContextData<Invitation[]>;
}

const DataLayerContext = createContext<DataLayerContextType | undefined>(
  undefined
);

export default function DataLayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<Set<Mode>>(new Set<Mode>());
  const [project, setProject] = useState<Project | null>(null);
  const [summary, setSummary] = useState<InitSummary | null>(null);
  const [invites, setInvites] = useState<Invitation[] | null>(null);
  const [projects, setProjects] = useState<Paginated<Projects>>({
    content: {
      collabs: [],
      authored: [],
    },
    totalElements: 0,
  });

  const load = useCallback(
    async (
      mode: Mode,
      apiCall: () => Promise<any>,
      setData: (data: any) => void
    ) => {
      setIsLoading((prev) => {
        const newSet = new Set(prev);
        newSet.add(mode);
        return newSet;
      });
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
        setIsLoading((prev) => {
          const newSet = new Set(prev);
          newSet.delete(mode);
          return newSet;
        });
      }
    },
    []
  );

  const loadProjects = useCallback(
    ({ page = 1, limit = 10 } = {}) =>
      load(
        Mode.PROJECTS,
        () => getUserProjects({ pagination: { limit, page } }),
        ({ content, totalElements }) => setProjects({ content, totalElements })
      ),
    [load]
  );

  const loadProject = useCallback(
    ({ id }: { id: string }) =>
      load(
        Mode.PROJECT,
        () => fetchProject(id),
        (res) => setProject(res)
      ),
    [load]
  );

  const loadSummary = useCallback(
    () =>
      load(
        Mode.SUMMARY,
        () => fetchInitSummary(),
        (res) => setSummary(res)
      ),
    [load]
  );

  const loadInvitations = useCallback(
    () =>
      load(
        Mode.INVITES,
        () => fetchInvitations(),
        (res) => setInvites(res)
      ),
    [load]
  );

  useEffect(() => {
    loadProjects();
    loadSummary();
    loadInvitations();
  }, [loadProjects, loadSummary, loadInvitations]);

  const value: DataLayerContextType = {
    projects: {
      data: projects,
      fetch: loadProjects,
      isLoading: isLoading.has(Mode.PROJECTS),
    },
    project: {
      data: project,
      fetch: loadProject,
      isLoading: isLoading.has(Mode.PROJECT),
    },
    summary: {
      data: summary,
      fetch: loadSummary,
      isLoading: isLoading.has(Mode.SUMMARY),
    },
    invites: {
      data: invites,
      fetch: loadInvitations,
      isLoading: isLoading.has(Mode.INVITES),
      update: setInvites,
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
