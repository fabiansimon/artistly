export enum ToastType {
  ERROR,
  WARNING,
  SUCCESS,
}

export enum BreakPoint {
  SM,
  MD,
  LG,
  XL,
  XXL,
}

export enum OperationSystem {
  WINDOWS,
  MAC,
  LINUX,
  IOS,
  ANDROID,
  MISC,
}

export type AudioFile = {
  file: File;
  duration: number;
  channels: number;
  sampleRate: number;
  intervalPeaks: number[];
  name: string;
};

export enum InputType {
  TITLE,
  DESCRIPTION,
  EMAIL,
  ADD_EMAIL,
}

export interface InputData {
  file: File | undefined;
  title: string;
  description: string;
  email: string;
  emailList: Set<string>;
}

export interface VersionUpload {
  title: string;
  fileUrl: string;
  feedbackNotes: string;
  projectId: string;
}

export interface Version {
  id: string;
  created_at: Date;
  title: string;
  file_url: string;
  notes: string;
  feedback: Comment[];
}

export interface User {
  id: string;
  email: string;
  created_at: Date;
  first_name?: string;
  last_name?: string;
}

export interface Comment {
  id: string;
  timestamp?: number;
  text: string;
}

export interface Project {
  id: string;
  created_at: Date;
  creator_id: string;
  title: string;
  versions: Version[];
  collaborators: User[];
}

export interface FeedbackUpload {
  text: string;
  versionId: string;
  timestamp?: number;
  creatorId: string;
}

export interface Input {
  text: string;
  timestamp?: number;
}

export interface AudioSettings {
  looping: boolean;
  playing: boolean;
}

export interface Range {
  begin: number;
  end: number;
}
