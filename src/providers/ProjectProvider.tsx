'use client';

import FeedbackInputModal from '@/components/FeedbackInputModal';
import {
  createShareable,
  deleteCollab,
  deleteFeedback,
  deleteInvite,
  deleteProject,
  deleteShareable,
  sendInvites,
  uploadFeedback,
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

interface ProjectContextType {
  project: Project | null;
  users: { [id: string]: User };
  version: (Version & { index: number }) | null;
  isAuthor: boolean;
  highlightedComment: string;
  setVersion: (version: (Version & { index: number }) | null) => void;
  toggleCommentInput: (timestamp?: number) => void;
  handleVersionChange: (id: string) => void;
  removeFeedback: (id: string) => void;
  addFeedback: (input: Input) => void;
  removeInvite: (id: string) => void;
  addInvites: (emails: string[]) => Promise<void>;
  removeShareable: () => Promise<void>;
  removeProject: () => Promise<void>;
  removeCollaboration: (userId: string) => Promise<void>;
  generateShareable: ({
    onlyRecentVersion,
    unlimitedVisits,
  }: {
    onlyRecentVersion: boolean;
    unlimitedVisits: boolean;
  }) => Promise<void>;
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

  const _addFeedback = useCallback((comment: Comment) => {
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
      if (!version || !project) return;
      const { text, timestamp } = input;
      const tempId = generateId();

      const newComment: Comment = {
        id: tempId,
        text,
        timestamp,
        creator: user,
        created_at: new Date(),
        creator_id: user.id,
      };

      try {
        _addFeedback(newComment);
        const { id } = await uploadFeedback({
          text,
          timestamp,
          versionId: version.id,
          projectId: project.id,
        });
        _updateFeedback(tempId, { ...newComment, id });
      } catch (error) {
        console.error(error);
        _removeFeedback(tempId);
      }
    },
    [version, _addFeedback, _removeFeedback, _updateFeedback, user, project]
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
        _addFeedback(comment);
      }
    },
    [version, _addFeedback, _removeFeedback]
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
    if (!invites) return;
    setProject((prev) => {
      if (!prev) return;
      return {
        ...prev,
        openInvites: [...prev.openInvites, ...invites],
      };
    });
  }, []);

  const _removeShareable = useCallback(() => {
    setProject((prev) => {
      if (!prev) return;
      return {
        ...prev,
        shareableUrl: undefined,
      };
    });
  }, []);

  const _addShareable = useCallback((url: string) => {
    setProject((prev) => {
      if (!prev) return;
      return {
        ...prev,
        shareableUrl: url,
      };
    });
  }, []);

  const _removeCollaborator = useCallback((userId: string) => {
    setProject((prev) => {
      if (!prev) return;
      return {
        ...prev,
        collaborators: prev.collaborators.filter((c) => c.id !== userId),
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
        await deleteInvite(project.id, id);
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
        const { invites } = await sendInvites(project.id, invitees);
        _addInvites(invites);
      } catch (error) {
        console.error(error);
      }
    },
    [project, _addInvites]
  );

  const removeShareable = useCallback(async () => {
    if (!project?.shareableUrl) return;
    try {
      const id = project.shareableUrl.split('/').pop();
      if (!id) return;
      await deleteShareable(id);
      _removeShareable();
    } catch (error) {
      console.error(error);
    }
  }, [project, _removeShareable]);

  const generateShareable = useCallback(
    async ({
      onlyRecentVersion,
      unlimitedVisits,
    }: {
      onlyRecentVersion: boolean;
      unlimitedVisits: boolean;
    }) => {
      if (!project) return;
      try {
        const { url } = await createShareable({
          projectId: project.id,
          onlyRecentVersion,
          unlimitedVisits,
        });
        _addShareable(url);
      } catch (error) {
        console.error(error);
      }
    },
    [project, _addShareable]
  );

  const removeProject = useCallback(async () => {
    if (!project?.id) return;
    try {
      await deleteProject(project.id);
    } catch (error) {
      console.error(error);
    }
  }, [project]);

  const removeCollaboration = useCallback(
    async (userId: string) => {
      if (!project?.collaborators) return;
      try {
        await deleteCollab(project.id, userId);
        _removeCollaborator(userId);
      } catch (error) {
        console.log(error);
      }
    },
    [project, _removeCollaborator]
  );

  const toggleCommentInput = useCallback((timestamp?: number) => {
    setCommentInput((prev) => ({
      isVisible: !prev.isVisible,
      timestamp: timestamp || prev.timestamp,
    }));
  }, []);

  const highlightedComment = useMemo(() => {
    if (!file || !version?.feedback) return '';
    const buffer = 4;
    for (const { id, timestamp } of version.feedback)
      if (timestamp && withinRange(file.duration, timestamp, buffer, time))
        return id;
    return '';
  }, [time, version, file]);

  const users = useMemo(() => {
    if (!project || !project.authors || !project.collaborators) return {};
    const map: { [id: string]: User } = {};
    project.authors.forEach((u) => (map[u.id] = u));
    project.collaborators.forEach((u) => (map[u.id] = u));
    return map;
  }, [project]);

  const isAuthor = useMemo(
    () => project?.creator_id === user.id,
    [project, user]
  );

  const value = {
    project,
    users,
    version,
    highlightedComment,
    isAuthor,
    setVersion,
    handleVersionChange,
    addFeedback,
    toggleCommentInput,
    removeFeedback,
    removeInvite,
    addInvites,
    removeShareable,
    removeProject,
    removeCollaboration,
    generateShareable,
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
