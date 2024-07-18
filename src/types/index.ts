import { MEMBERSHIP } from '@/constants/memberships';

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
  VERSION_TITLE,
  VERSION_DESCRIPTION,
}

export type EditProjectInput = {
  versions: Omit<VersionInputData, 'file'>[];
} & Omit<Project, 'id' | 'created_at' | 'creator_id' | 'versions'>;

interface Invite {
  id: string;
  email: string;
  created_at: Date;
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
  image_url: string;
  membership: MembershipType;
}

export interface UpdateUser {
  email?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  membership?: MembershipType;
}

export type SignUpUser = Omit<User, 'created_at' | 'id' | 'membership'>;

export interface Comment {
  id: string;
  timestamp?: number;
  text: string;
  creator_id: string;
  creator: User;
}

export interface Project {
  id: string;
  created_at: Date;
  creator_id: string;
  authors: User[];
  title: string;
  description: string;
  versions: Version[];
  collaborators: User[];
  openInvites: Invite[];
}

export type LeanProject = Omit<
  Project,
  'created_at' | 'creator_id' | 'collaborators' | 'description' | 'authors'
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

export enum UsageLimit {
  versions = 0,
  projects = 1,
  collaborators = 2,
  authors = 3,
}

export type MembershipType = (typeof MEMBERSHIP)[keyof typeof MEMBERSHIP];
