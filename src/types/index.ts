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
