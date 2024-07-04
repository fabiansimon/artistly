import ToastController from '@/controllers/ToastController';
import { AudioFile } from '@/types';
import axios from 'axios';
import { fetchAudioBlob, openDatabase, storeAudioBlob } from './indexedDB';

const STORE_NAME = 'audioStore';
const DB_NAME = 'audioDB';

export async function storeAudioFile(url: string, id: string) {
  try {
    const name = id;
    const file = await downloadAudio(url, name);
    if (!file) return;
    const audioData = await analyzeAudio(file);

    const db = await openDatabase({
      dbName: DB_NAME,
      dbVersion: 1,
      storeName: STORE_NAME,
    });

    await storeAudioBlob({
      db: db as IDBDatabase,
      blob: audioData,
      id,
      storeName: STORE_NAME,
    });

    return audioData;
  } catch (error) {
    ToastController.showErrorToast('Error download Audiofile.', error.message);
  }
}

export async function fetchAudioFile(id: string) {
  try {
    const db = await openDatabase({
      dbName: DB_NAME,
      dbVersion: 1,
      storeName: STORE_NAME,
    });
    const file = (await fetchAudioBlob({
      db: db as IDBDatabase,
      storeName: STORE_NAME,
      id,
    })) as AudioFile;
    return file;
  } catch (error) {
    return null;
  }
}

export async function downloadAudio(url: string, name: string) {
  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = response.data;
    return new File([blob], name, { type: 'audio/mpeg' });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function analyzeAudio(file: File): Promise<AudioFile> {
  const audioContext = new window.AudioContext();

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target?.result) reject(new Error('Failed to read file'));

        resolve(event.target!.result as ArrayBuffer);
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const { duration, numberOfChannels, sampleRate } = audioBuffer;
  const channelData = audioBuffer.getChannelData(0);

  const skipInterval = channelData.length / duration;
  const intervalPeaks: number[] = [];
  let currTotal = 0;

  for (let i = 0; i < channelData.length; i++) {
    if (i !== 0 && i % skipInterval == 0) {
      intervalPeaks.push(currTotal / skipInterval);
      currTotal = 0;
      continue;
    }

    currTotal += Math.abs(channelData[i]);
  }

  const audioData: AudioFile = {
    channels: numberOfChannels,
    duration: duration,
    sampleRate: sampleRate,
    intervalPeaks,
    name: file.name,
    file,
  };

  return audioData;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function dataURLToBlob(dataURL: string): Blob {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ab], { type: mimeString });
}
