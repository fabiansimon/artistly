'use client';

import FeedbackInputModal from '@/components/FeedbackInputModal';
import { deleteFeedback, uploadFeeback } from '@/lib/api';
import { generateId, withinRange } from '@/lib/utils';
import { Comment, Input, Project, User, Version } from '@/types';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useAudioContext } from './AudioProvider';
import { useDataLayerContext } from './DataLayerProvider';
import { useUserContext } from './UserProvider';

interface ProjectContextType {
  project: Project | null;
  users: { [id: string]: User };
  version: (Version & { index: number }) | null;
  highlightedComment: string;
  setVersion: (version: (Version & { index: number }) | null) => void;
  toggleCommentInput: (timestamp?: number) => void;
  handleVersionChange: (id: string) => void;
  removeFeedback: (id: string) => void;
  addFeedback: (input: Input) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export default function ProjectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { file, time, onVersionChange } = useAudioContext();
  const { user } = useUserContext();
  const {
    project: { data: project },
  } = useDataLayerContext();

  const [commentInput, setCommentInput] = useState<{
    isVisible: boolean;
    timestamp?: number;
  }>({ isVisible: false });
  const [version, setVersion] = useState<(Version & { index: number }) | null>(
    null
  );

  const handleVersionChange = useCallback(
    async (id: string) => {
      if (!project) return;
      const { versions } = project;
      const index = versions.findIndex((v: Version) => v.id === id);
      const newVersion = project.versions[index];
      onVersionChange(newVersion);
      setVersion({ ...newVersion, index });
    },
    [project, onVersionChange]
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
        creator: user,
        creator_id: user.id,
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
    return '';
  }, [time, version, file]);

  const users = useMemo(() => {
    if (!project) return {};
    const map: { [id: string]: User } = {};
    project.authors.forEach((u) => (map[u.id] = u));
    project.collaborators.forEach((u) => (map[u.id] = u));
    return map;
  }, [project]);

  const value = {
    project,
    users,
    version,
    highlightedComment,
    setVersion,
    handleVersionChange,
    addFeedback,
    toggleCommentInput,
    removeFeedback,
  };
  return (
    <ProjectContext.Provider value={value}>
      <>
        {children}
        <FeedbackInputModal
          onRequestClose={() => setCommentInput({ isVisible: false })}
          isVisible={commentInput.isVisible}
          timestamp={commentInput.timestamp}
        />
      </>
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);

  if (!context)
    throw new Error('useProjectContext must be used within a ProjectProvider');

  return context;
}
