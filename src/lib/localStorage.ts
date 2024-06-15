import { AudioFile, InputData } from '@/types';

const KEYS = {
  audioFile: 'audioFile',
  inputData: 'initData',
};

export class LocalStorage {
  static saveAudioData(audio: AudioFile) {
    localStorage.setItem(KEYS.audioFile, JSON.stringify(audio));
  }

  static fetchAudioData(): AudioFile | undefined {
    const res = localStorage.getItem(KEYS.audioFile);
    if (!res) return;

    return JSON.parse(res);
  }

  static saveInputData(input: InputData) {
    const serialized = {
      ...input,
      emailList: Array.from(input.emailList),
    };
    localStorage.setItem(KEYS.inputData, JSON.stringify(serialized));
  }

  static fetchInputData(): InputData | undefined {
    const res = localStorage.getItem(KEYS.inputData);
    if (!res) return;

    const parsed = JSON.parse(res);
    return {
      ...parsed,
      emailList: new Set(parsed.emailList),
    };
  }
}
