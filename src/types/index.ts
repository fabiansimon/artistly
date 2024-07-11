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

export interface ProjectInputData {
  title: string;
  description: string;
  email: string;
  emailList: Set<string>;
}

export interface VersionInputData {
  title: string;
  notes: string;
  file: AudioFile;
}

export interface VersionUpload {
  title: string;
  fileUrl: string;
  notes: string;
  projectId: string;
  creatorId: string;
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
  first_name: string;
  last_name: string;
  image_url?: string;
}

export type SignUpUser = Omit<User, 'created_at' | 'id'>;

export interface Comment {
  id: string;
  timestamp?: number;
  text: string;
}

export interface Project {
  id: string;
  created_at: Date;
  creator_id: string;
  author: User;
  title: string;
  description: string;
  versions: Version[];
  collaborators: User[];
}

export type LeanProject = Omit<
  Project,
  'created_at' | 'creator_id' | 'collaborators' | 'description' | 'author'
>;

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

export interface MenuOption {
  text: string;
  icon: React.ReactNode;
  confirm?: boolean;
  ignore?: boolean;
  onClick: (args?: any) => any | void;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface NavOption {
  title: string;
  route?: string;
  onClick?: () => void;
  icon: React.ReactNode;
}

export interface Navigation {
  title: string;
  options: NavOption[];
}

export interface Projects {
  collabs: Project[];
  authored: Project[];
}

export interface Paginated<T> {
  totalElements: number;
  content: T;
}
