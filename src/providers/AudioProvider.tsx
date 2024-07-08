'use client';

import FeedbackInputModal from '@/components/FeedbackInputModal';
import { deleteFeedback, uploadFeeback } from '@/lib/api';
import { fetchAudioFile, storeAudioFile } from '@/lib/audioHelpers';
import { generateId, withinRange } from '@/lib/utils';
import {
  AudioFile,
  AudioSettings,
  Comment,
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
  useMemo,
  useRef,
  useState,
} from 'react';

interface AudioContextType {
  settings: AudioSettings;
  range: Range;
  time: number;
  project: Project | null;
  version: (Version & { index: number }) | null;
  file: AudioFile | null;
  highlightedComment: string;
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
  toggleCommentInput: (timestamp?: number) => void;
  removeFeedback: (id: string) => void;
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
  const [commentInput, setCommentInput] = useState<{
    isVisible: boolean;
    timestamp?: number;
  }>({ isVisible: false });
  const [project, setProject] = useState<Project | null>(null);
  const [file, setFile] = useState<AudioFile | null>(null);
  const [range, setRange] = useState<Range>({ begin: 0, end: 0 });
  const [version, setVersion] = useState<(Version & { index: number }) | null>(
    null
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!version) return;
    togglePlaying();
    (async () => {
      const { id, file_url } = version;
      const cached = await fetchAudioFile(id);
      if (cached) return setFile(cached);

      const data = await storeAudioFile(file_url, id);
      if (!data) return;
      setFile(data);
    })();
  }, [version]);

  useEffect(() => {
    const { playing } = settings;
    if (playing) audioRef.current?.play();
    else audioRef?.current?.pause();
  }, [settings, audioRef]);

  const handleVersionChange = useCallback(
    async (id: string) => {
      if (!project) return;
      const { versions } = project;
      const index = versions.findIndex((v: Version) => v.id === id);
      setVersion({ ...project?.versions[index], index });
    },
    [project]
  );

  const addComment = useCallback((comment: Comment) => {
    setVersion((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        feedback: prev.feedback.concat(comment),
      };
    });
  }, []);

  const updateComment = useCallback((id: string, comment: Comment) => {
    setVersion((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        feedback: prev.feedback.map((f) => (f.id === id ? comment : f)),
      };
    });
  }, []);

  const removeComment = useCallback((id: string) => {
    setVersion((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        feedback: prev.feedback.filter((f) => f.id !== id),
      };
    });
  }, []);

  const addFeedback = useCallback(
    async (input: Input) => {
      if (!version) return;
      const { text, timestamp } = input;
      const tempId = generateId();

      const newComment: Comment = {
        id: tempId,
        text,
        timestamp,
      };

      try {
        addComment(newComment);
        const { id } = await uploadFeeback({
          text,
          timestamp,
          versionId: version.id,
        });
        updateComment(tempId, { ...newComment, id });
      } catch (error) {
        console.error(error);
        removeComment(tempId);
      }
    },
    [version, addComment, removeComment, updateComment]
  );

  const removeFeedback = useCallback(
    async (id: string) => {
      const comment = version?.feedback.find((f) => f.id === id);
      if (!comment) return;

      removeComment(id);
      try {
        await deleteFeedback({
          id,
        });
      } catch (error) {
        console.error(error);
        addComment(comment);
      }
    },
    [version, addComment, removeComment]
  );

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
        playing: status || !prev.playing,
      }));
    },
    [outOfBoundsCheck, setSettings]
  );

  const toggleLoop = useCallback(
    (status?: boolean) => {
      outOfBoundsCheck();
      setSettings((prev) => ({
        ...prev,
        looping: status || !prev.looping,
      }));
    },
    [outOfBoundsCheck, setSettings]
  );

  const toggleCommentInput = useCallback((timestamp?: number) => {
    setCommentInput((prev) => ({
      isVisible: !prev.isVisible,
      timestamp: timestamp || prev.timestamp,
    }));
  }, []);

  const highlightedComment = useMemo(() => {
    if (!file || !version) return '';
    const buffer = 4;
    for (const { id, timestamp } of version.feedback)
      if (timestamp && withinRange(file.duration, timestamp, buffer, time))
        return id;
  }, [time, version, file]);

  useEffect(() => {
    outOfBoundsCheck();
  }, [settings.playing, outOfBoundsCheck]);

  const value = {
    settings,
    range,
    time,
    project,
    version,
    file,
    audioRef,
    highlightedComment,
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
    toggleCommentInput,
    removeFeedback,
  };

  return (
    <>
      <AudioContext.Provider value={value}>
        {
          <>
            {children}
            <FeedbackInputModal
              onRequestClose={() => setCommentInput({ isVisible: false })}
              isVisible={commentInput.isVisible}
              timestamp={commentInput.timestamp}
            />
          </>
        }
      </AudioContext.Provider>
    </>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context)
    throw new Error('useAudioContext must be used within an AudioProvider');

  return context;
}
