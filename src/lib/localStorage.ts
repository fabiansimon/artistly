import { AudioFile } from '@/types';

const KEYS = {
  audioFile: 'audioFile',
};

export class LocalStorage {
  static saveAudioData(audio: AudioFile) {
    localStorage.setItem(KEYS.audioFile, JSON.stringify(audio));
  }

  static fetchAudioData() {
    const res = localStorage.getItem(KEYS.audioFile);
    if (!res) return;

    return JSON.parse(res);
  }
}
