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
  title: string;
  description: string;
  email: string;
  emailList: Set<string>;
}

export function inputDataEmpty(inputData: InputData): boolean {
  return (
    inputData.description.trim() === '' &&
    inputData.email.trim() === '' &&
    inputData.emailList.size === 0
  );
}
