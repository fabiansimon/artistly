import { AudioFile, InputData } from '@/types';
import { dataURLToBlob, fileToBase64 } from './audioHelpers';

const KEYS = {
  audioFile: 'audioFile',
  inputData: 'initData',
};

export class LocalStorage {
  static async saveAudioFile(data: AudioFile) {
    const audioBase64 = await fileToBase64(data.file);
    const serialized = {
      ...data,
      file: audioBase64,
    };

    localStorage.setItem(KEYS.audioFile, JSON.stringify(serialized));
  }

  static fetchAudioFile(): AudioFile | null {
    const res = localStorage.getItem(KEYS.audioFile);
    if (!res) return null;

    const parsed = JSON.parse(res);
    const blob = dataURLToBlob(parsed.file);

    const file = new File([blob], parsed.name, { type: blob.type });

    return {
      ...parsed,
      file,
    };
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
