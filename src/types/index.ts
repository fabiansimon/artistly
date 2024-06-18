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

export interface Version {
  title: string;
  fileUrl: string;
  feedbackNotes: string;
  projectId: string;
}
