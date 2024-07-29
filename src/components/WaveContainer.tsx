import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import CursorLine from './CursorLine';
import { useAudioContext } from '@/providers/AudioProvider';
import { useProjectContext } from '@/providers/ProjectProvider';

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
  const { version } = useProjectContext();

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
    const duration = audioRef.current.duration;
    const time = Math.min(duration, timestamp);
    audioRef.current.currentTime = time;
    setTime(time);
  };

  const waveClass =
    'top-0 flex w-full left-0 items-end space-x-1 justify-between';

  return (
    <div className="flex flex-grow w-full">
      <audio
        loop={settings.looping}
        onEnded={() => setSettings((prev) => ({ ...prev, playing: false }))}
        ref={audioRef}
        src={version?.file_url}
      >
        Your browser does not support the audio element.
      </audio>
      {emptyWave && (
        <div className="skeleton flex flex-grow h-14 min-w-full"></div>
      )}
      {!emptyWave && (
        <div
          onMouseEnter={() => setCursorVisible(true)}
          onMouseLeave={() => setCursorVisible(false)}
          onClick={handleClick}
          className={cn('relative w-full', className)}
        >
          <div className={waveClass}>
            {file?.intervalPeaks.map((peak, index) => (
              <div
                key={index}
                style={{ height: peak * AMPLIFY_BY }}
                className={cn(
                  'flex-grow bg-slate-50 rounded-full max-w-[1px] min-h-1',
                  'opacity-30'
                )}
              />
            ))}
          </div>
          <div
            style={{ clipPath }}
            className={cn('absolute', waveClass)}
          >
            {file?.intervalPeaks.map((peak, index) => (
              <div
                key={index}
                style={{ height: peak * AMPLIFY_BY }}
                className={cn(
                  'flex-grow bg-slate-50 rounded-full max-w-[1px] min-h-1'
                )}
              />
            ))}
          </div>
          {!simple && (
            <CursorLine
              style={{ left: `${percentage}%` }}
              cursorVisible={cursorVisible}
              time={time}
            />
          )}
        </div>
      )}
    </div>
  );
}
