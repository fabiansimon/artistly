'use client';

import { fetchAudioFile, storeAudioFile } from '@/lib/audioHelpers';
import { AudioFile, AudioSettings, Range, Version } from '@/types';
import { version } from 'os';
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
  range: Range;
  time: number;
  file: AudioFile | null;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setSettings: Dispatch<SetStateAction<AudioSettings>>;
  setRange: Dispatch<SetStateAction<Range>>;
  setTime: (time: number) => void;
  setFile: (file: AudioFile | null) => void;
  jumpTo: (timestamp: number) => void;
  toggleLoop: (status?: boolean) => void;
  togglePlaying: (status?: boolean) => void;
  onVersionChange: (version: Version) => void;
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
  const [file, setFile] = useState<AudioFile | null>(null);
  const [range, setRange] = useState<Range>({ begin: 0, end: 0 });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const onVersionChange = async (version: Version) => {
    togglePlaying();
    const { id, file_url } = version;
    const cached = await fetchAudioFile(id);
    if (cached) return setFile(cached);

    const data = await storeAudioFile(file_url, id);
    if (!data) return;
    setFile(data);
  };

  const jumpTo = useCallback(
    (timestamp: number) => {
      if (!audioRef.current) return;
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = Math.min(duration, timestamp || 1);
      if (!settings.playing) togglePlaying(true);
    },
    [settings.playing, setSettings, audioRef]
  );

  const outOfBoundsCheck = useCallback(() => {
    if (!range) return;
    const { begin, end } = range;
    if (settings.looping && (time < begin || time > end)) jumpTo(begin);
  }, [range, time, jumpTo, settings]);

  const togglePlaying = useCallback(
    (status?: boolean) => {
      outOfBoundsCheck();
      setSettings((prev) => ({
        ...prev,
        playing: status ?? !prev.playing,
      }));
    },
    [outOfBoundsCheck, setSettings]
  );

  const toggleLoop = useCallback(
    (status?: boolean) => {
      outOfBoundsCheck();
      setSettings((prev) => ({
        ...prev,
        looping: status ?? !prev.looping,
      }));
    },
    [outOfBoundsCheck, setSettings]
  );

  useEffect(() => {
    const { playing } = settings;
    if (playing) audioRef.current?.play();
    else audioRef?.current?.pause();
  }, [settings, audioRef]);

  useEffect(() => {
    outOfBoundsCheck();
  }, [settings.playing, outOfBoundsCheck]);

  const value = {
    settings,
    range,
    time,
    file,
    audioRef,
    setSettings,
    setRange,
    setTime,
    setFile,
    jumpTo,
    togglePlaying,
    onVersionChange,
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
