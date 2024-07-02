import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import CursorLine from './CursorLine';
import { useAudioContext } from '@/providers/AudioProvider';

interface WaveContainerProps {
  className?: string;
  amplifyBy?: number;
  duration?: number;
  simple?: boolean;
  onTap?: (time: number) => void;
}

export default function WaveContainer({
  simple = false,
  className,
  amplifyBy,
}: WaveContainerProps) {
  const { time, settings, file, audioRef, setTime, setSettings } =
    useAudioContext();
  const [cursorVisible, setCursorVisible] = useState<boolean>(false);

  const AMPLIFY_BY = amplifyBy || 100;

  const emptyWave = file?.intervalPeaks.length === 0;

  const { percentage, clipPath } = useMemo(() => {
    if (!audioRef.current) return { percentage: 0, clipPath: '' };
    let percentage = (time / audioRef.current.duration) * 100;
    return {
      clipPath: `inset(0 ${100 - percentage}% 0 0)`,
      percentage,
    };
  }, [time, audioRef]);

  useEffect(() => {
    if (emptyWave) populateWave();
  }, [emptyWave]);

  useEffect(() => {
    const updateTime = () => {
      if (!audioRef.current) return;
      setTime(audioRef.current.currentTime);
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateTime);
      return () => {
        audioElement.removeEventListener('timeupdate', updateTime);
      };
    }
  }, []);

  const populateWave = () => {
    console.log('now');
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (simple || !audioRef.current) return;

    const duration = audioRef.current.duration;
    const { left, width } = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect();
    const offsetX = e.clientX - left;
    const percentage = (offsetX / width) * 100;
    const time = duration * (percentage / 100);
    updateTime(time);
  };

  const updateTime = (timestamp: number) => {
    if (!audioRef.current) return;
    const duration = audioRef.current?.duration || 0;
    const time = Math.min(duration, timestamp);
    audioRef.current.currentTime = time;
    setTime(time);
  };

  return (
    <div className="flex flex-grow w-full">
      <audio
        loop={settings.looping}
        onEnded={() => setSettings((prev) => ({ ...prev, playing: false }))}
        ref={audioRef}
        src="https://oubmdyvsxvckiwvnxwty.supabase.co/storage/v1/object/sign/artistly_bucket/uploads/4894cdd8-8cca-4bfd-9adb-0e6fa919358e?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcnRpc3RseV9idWNrZXQvdXBsb2Fkcy80ODk0Y2RkOC04Y2NhLTRiZmQtOWFkYi0wZTZmYTkxOTM1OGUiLCJpYXQiOjE3MTk1ODE1MjgsImV4cCI6MTc1MTExNzUyOH0.v8MM5a8gWUvXlj91FTQWubDzVO1II5LMGq9e-w5aqbM&t=2024-06-28T13%3A32%3A08.817Z"
      >
        Your browser does not support the audio element.
      </audio>
      {emptyWave && (
        <div className="skeleton flex flex-grow h-14 min-w-full"></div>
      )}
      {emptyWave && (
        <div
          onMouseEnter={() => setCursorVisible(true)}
          onMouseLeave={() => setCursorVisible(false)}
          onClick={handleClick}
          className={cn('relative w-full', className)}
        >
          <div className="top-0 flex w-full left-0 items-center space-x-1">
            {file?.intervalPeaks.map((peak, index) => (
              <div
                key={index}
                style={{ height: Math.max(peak * AMPLIFY_BY, 3) }}
                className={cn(
                  'flex-grow bg-slate-50 rounded-full',
                  'opacity-30'
                )}
              />
            ))}
          </div>
          <div
            style={{ clipPath }}
            className="absolute top-0 flex w-full left-0 items-center space-x-1"
          >
            {file?.intervalPeaks.map((peak, index) => (
              <div
                key={index}
                style={{ height: Math.max(peak * AMPLIFY_BY, 1) }}
                className={cn('flex-grow bg-slate-50 rounded-full')}
              />
            ))}
            {!simple && (
              <CursorLine
                style={{ left: `${percentage}%` }}
                cursorVisible={cursorVisible}
                time={time}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
