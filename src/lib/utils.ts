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

  const skipInterval = (channelData.length / duration) * 10;
  const intervalPeaks: number[] = [];
  for (let i = 0; i < channelData.length; i += skipInterval) {
    intervalPeaks.push(channelData[i]);
  }

  const audioData: AudioFile = {
    channels: numberOfChannels,
    duration: duration,
    sampleRate: sampleRate,
    intervalPeaks,
    name: file.name,
  };

  return audioData;
}
