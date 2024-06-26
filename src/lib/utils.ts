import { AudioFile } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
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

  for (const peak of intervalPeaks) console.log(peak);

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

export function formatSeconds(seconds: number) {
  if (!seconds) return 0;
  return new Date(seconds * 1000).toISOString().slice(14, 19);
}

export function ordinalString(number: number) {
  const last = number % 10;
  const lastTwo = number % 100;

  if (lastTwo === 11 || lastTwo === 12 || lastTwo === 13) return number + 'th';

  switch (last) {
    case 1:
      return number + 'st';
    case 2:
      return number + 'nd';
    case 3:
      return number + 'rd';
    default:
      return number + 'th';
  }
}
