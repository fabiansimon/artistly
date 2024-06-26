import { uploadFeeback } from '@/lib/api';
import {
  AudioFile,
  AudioSettings,
  Input,
  Project,
  Range,
  Version,
} from '@/types';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface AudioContextType {
  settings: AudioSettings;
  region: Range;
  time: number;
  project: Project | null;
  version: (Version & { index: number }) | null;
  file: AudioFile | null;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setSettings: Dispatch<SetStateAction<AudioSettings>>;
  setRange: Dispatch<SetStateAction<Range>>;
  setTime: (time: number) => void;
  setProject: (project: Project | null) => void;
  setVersion: (version: (Version & { index: number }) | null) => void;
  setFile: (file: AudioFile | null) => void;
  handleVersionChange: (id: string) => void;
  addFeedback: (input: Input) => void;
  jumpTo: (timestamp: number) => void;
  toggleLoop: (status?: boolean) => void;
  togglePlaying: (status?: boolean) => void;
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
  const [time, setTime] = useState<number>(0);
  const [project, setProject] = useState<Project | null>(null);
  const [file, setFile] = useState<AudioFile | null>(null);
  const [range, setRange] = useState<Range>({ begin: 0, end: 0 });
  const [version, setVersion] = useState<(Version & { index: number }) | null>(
    null
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const { playing } = settings;
    if (playing) audioRef.current?.play();
    else audioRef?.current?.pause();
  }, [settings]);

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

  const togglePlaying = useCallback((status?: boolean) => {
    setSettings((prev) => ({
      ...prev,
      playing: status || !prev.playing,
    }));
  }, []);

  const toggleLoop = useCallback((status?: boolean) => {
    setSettings((prev) => ({
      ...prev,
      looping: status || !prev.looping,
    }));
  }, []);

  const jumpTo = useCallback(
    (timestamp: number) => {
      if (!audioRef.current) return;
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = Math.min(duration, timestamp);
      if (!settings.playing) togglePlaying(true);
    },
    [settings.playing, togglePlaying]
  );

  const value = {
    settings,
    range,
    time,
    project,
    version,
    file,
    audioRef,
    setSettings,
    setRange,
    setTime,
    setProject,
    setVersion,
    setFile,
    handleVersionChange,
    addFeedback,
    jumpTo,
    togglePlaying,
    toggleLoop,
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
