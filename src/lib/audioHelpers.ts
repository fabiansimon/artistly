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
    console.log(error);
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

  const interval = Math.ceil(channelData.length / 100);
  let intervalPeaks: number[] = [];
  let high = 0;
  let count = 0;

  for (let i = 0; i < channelData.length; i++) {
    count += Math.abs(channelData[i]);

    if ((i + 1) % interval === 0 || i === channelData.length - 1) {
      const peak = count / interval;
      intervalPeaks.push(peak);
      high = Math.max(high, peak);
      count = 0;
    }
  }

  intervalPeaks.map((peak) => peak / high);

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

export async function clientDownload(
  name: string,
  id: string,
  fileUrl: string
) {
  try {
    const file = await fetchFile(id, fileUrl);

    const url = URL.createObjectURL(file);
    const a = document.createElement('a');

    a.href = url;
    a.setAttribute('download', name);

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading the file');
    ToastController.showErrorToast();
  }
}

async function fetchFile(id: string, url: string) {
  let res = await fetchAudioFile(id);
  if (res) {
    return res.file;
  }
  const newFile = await storeAudioFile(url, id);
  if (!newFile) {
    throw new Error('Something went wrong while fetching the audio.');
  }
  return newFile.file;
}
