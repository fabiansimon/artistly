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
  onAdd?: (time: number) => void;
}

export default function WaveContainer({
  simple = false,
  className,
  amplifyBy,
  onAdd,
}: WaveContainerProps) {
  const { time, settings, file, audioRef, setTime, setSettings } =
    useAudioContext();
  const [cursorVisible, setCursorVisible] = useState<boolean>(false);

  const AMPLIFY_BY = amplifyBy || 100;

  const { percentage, clipPath } = useMemo(() => {
    if (!audioRef.current) return { percentage: 0, clipPath: '' };
    let percentage = (time / audioRef.current.duration) * 100;
    return {
      clipPath: `inset(0 ${100 - percentage}% 0 0)`,
      percentage,
    };
  }, [time, audioRef]);

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
        src="https://oubmdyvsxvckiwvnxwty.supabase.co/storage/v1/object/sign/artistly_bucket/uploads/69ea7685-e32c-4ef7-a384-c26288fe7aca?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcnRpc3RseV9idWNrZXQvdXBsb2Fkcy82OWVhNzY4NS1lMzJjLTRlZjctYTM4NC1jMjYyODhmZTdhY2EiLCJpYXQiOjE3MTg4NjIyOTUsImV4cCI6MTcxOTQ2NzA5NX0.PI1qDFZ9MAoV2fzDYlc_q1MItmqy2sV56Nm_01WwrbU&t=2024-06-20T05%3A44%3A55.186Z"
      >
        Your browser does not support the audio element.
      </audio>
      <div
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => setCursorVisible(false)}
        onClick={handleClick}
        className={cn('relative w-full', className)}
      >
        <div className="absolute top-0 flex w-full left-0 items-center space-x-1">
          {file?.intervalPeaks.map((peak, index) => (
            <div
              key={index}
              style={{ height: Math.max(peak * AMPLIFY_BY, 3) }}
              className={cn('flex-grow bg-slate-50 rounded-full', 'opacity-30')}
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
        </div>
        {!simple && (
          <CursorLine
            style={{ left: `${percentage}%` }}
            cursorVisible={cursorVisible}
            onAdd={onAdd}
            time={time}
          />
        )}
      </div>
    </div>
  );
}
