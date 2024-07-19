'use client';

import FeedbackInputModal from '@/components/FeedbackInputModal';
import {
  deleteFeedback,
  removeInvite,
  sendInvites,
  uploadFeeback,
} from '@/lib/api';
import { generateId, withinRange } from '@/lib/utils';
import { Comment, Input, Invite, Project, User, Version } from '@/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAudioContext } from './AudioProvider';
import { useDataLayerContext } from './DataLayerProvider';
import { useUserContext } from './UserProvider';
import ToastController from '@/controllers/ToastController';

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
  removeInvitation: (id: string) => void;
  addInvites: (emails: string[]) => Promise<void>;
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
    project: { data },
  } = useDataLayerContext();

  const [project, setProject] = useState<Project | null>();
  const [commentInput, setCommentInput] = useState<{
    isVisible: boolean;
    timestamp?: number;
  }>({ isVisible: false });
  const [version, setVersion] = useState<(Version & { index: number }) | null>(
    null
  );

  useEffect(() => {
    if (!data) return;
    setProject(data);
  }, [data]);

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

  const _addFeeback = useCallback((comment: Comment) => {
    setVersion((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        feedback: prev.feedback.concat(comment),
      };
    });
  }, []);

  const _updateFeedback = useCallback((id: string, comment: Comment) => {
    setVersion((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        feedback: prev.feedback.map((f) => (f.id === id ? comment : f)),
      };
    });
  }, []);

  const _removeFeedback = useCallback((id: string) => {
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
        _addFeeback(newComment);
        const { id } = await uploadFeeback({
          text,
          timestamp,
          versionId: version.id,
        });
        _updateFeedback(tempId, { ...newComment, id });
      } catch (error) {
        console.error(error);
        _removeFeedback(tempId);
      }
    },
    [version, _addFeeback, _removeFeedback, _updateFeedback, user]
  );

  const removeFeedback = useCallback(
    async (id: string) => {
      const comment = version?.feedback.find((f) => f.id === id);
      if (!comment) return;

      _removeFeedback(id);
      try {
        await deleteFeedback({
          id,
        });
      } catch (error) {
        console.error(error);
        _addFeeback(comment);
      }
    },
    [version, _addFeeback, _removeFeedback]
  );

  const _removeInvite = useCallback((inviteId: string) => {
    setProject((prev) => {
      if (!prev) return;
      return {
        ...prev,
        openInvites: prev.openInvites.filter(({ id }) => id !== inviteId),
      };
    });
  }, []);

  const _addInvite = useCallback(
    ({ invite, index }: { invite: Invite; index?: number }) => {
      setProject((prev) => {
        if (!prev) return;
        let newInvites = prev.openInvites;
        newInvites.splice(index ?? newInvites.length, 0, invite);
        return {
          ...prev,
          openInvites: newInvites,
        };
      });
    },
    []
  );

  const _addInvites = useCallback((invites: Invite[]) => {
    setProject((prev) => {
      if (!prev) return;
      return {
        ...prev,
        openInvites: [...prev.openInvites, ...invites],
      };
    });
  }, []);

  const removeInvite = useCallback(
    async (id: string) => {
      if (!project) return;
      const { openInvites } = project;
      const index = openInvites.findIndex(({ id: _id }) => _id === id);
      const invite = openInvites[index];
      try {
        _removeInvite(id);
        await removeInvite(project.id, id);
      } catch (error) {
        _addInvite({ invite, index });
      }
    },
    [_addInvite, _removeInvite, project]
  );

  const addInvites = useCallback(
    async (emails: string[]) => {
      if (!project) return;
      const invitees = JSON.stringify(Array.from(emails));
      try {
        const res = await sendInvites(project.id, invitees);
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    },
    [_addInvites, project]
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
    removeInvite,
    addInvites,
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
