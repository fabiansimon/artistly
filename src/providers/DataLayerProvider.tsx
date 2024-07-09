'use client';

import ToastController from '@/controllers/ToastController';
import { getUserProjects } from '@/lib/api';
import { Paginated, Projects } from '@/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

enum MODE {
  projects,
}

interface ContextData<T> {
  data: T;
  refetch: (args?: any) => Promise<void>;
  isLoading: boolean;
}

interface DataLayerContextType {
  projects: ContextData<Paginated<Projects>>;
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

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const value = {
    projects: {
      data: projects,
      refetch: loadProjects,
      isLoading: isLoading === MODE.projects,
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
