import { uploadFeeback } from '@/lib/api';
import {
  AudioFile,
  AudioSettings,
  Input,
  Project,
  Region,
  Version,
} from '@/types';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';

interface AudioContextType {
  settings: AudioSettings;
  region: Region;
  time: number;
  project: Project | null;
  version: (Version & { index: number }) | null;
  file: AudioFile | null;
  setSettings: Dispatch<SetStateAction<AudioSettings>>;
  setRegions: Dispatch<SetStateAction<Region>>;
  setTime: (time: number) => void;
  setProject: (project: Project | null) => void;
  setVersion: (version: (Version & { index: number }) | null) => void;
  setFile: (file: AudioFile | null) => void;
  handleVersionChange: (id: string) => void;
  addFeedback: (input: Input) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export default function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<AudioSettings>({
    looping: true,
    playing: false,
  });
  const [region, setRegions] = useState<Region>({ begin: 0, end: 0 });
  const [time, setTime] = useState<number>(0);
  const [project, setProject] = useState<Project | null>(null);
  const [file, setFile] = useState<AudioFile | null>(null);
  const [version, setVersion] = useState<(Version & { index: number }) | null>(
    null
  );

  const handleVersionChange = useCallback(
    async (id: string) => {
      if (!project) return;
      const { versions } = project;
      const index = versions.findIndex((v: Version) => v.id === id);
      setVersion({ ...project?.versions[index], index: index + 1 });
    },
    [project]
  );

  const addFeedback = useCallback(
    async (input: Input) => {
      if (!version) return;
      const { text, timestamp } = input;
      try {
        const result = await uploadFeeback({
          text,
          timestamp,
          versionId: version.id,
        });
      } finally {
        console.log('got it ');
      }
    },
    [version]
  );

  const value = {
    settings,
    region,
    time,
    project,
    version,
    file,
    setSettings,
    setRegions,
    setTime,
    setProject,
    setVersion,
    setFile,
    handleVersionChange,
    addFeedback,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context)
    throw new Error('useAudioContext must be used within an AudioProvider');

  return context;
}
