import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const OFFSET = 50;
const DURATION = 2000;

export default function AnimatedText({
  strings,
  className,
}: {
  strings: string[];
  className: string;
}) {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % strings.length),
      DURATION
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn('relative flex justify-center', className)}>
      {strings.map((string, i) => {
        let currAnimation: string;
        if (i === index) {
          currAnimation = 'center';
        } else if (i % 2) {
          currAnimation = 'top';
        } else {
          currAnimation = 'bottom';
        }

        return (
          <motion.div
            className="absolute"
            key={i}
            animate={currAnimation}
            variants={{
              top: { translateY: -OFFSET, opacity: 0 },
              center: { translateY: 0, opacity: 1 },
              bottom: { translateY: OFFSET, opacity: 0 },
            }}
            initial={false}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-center text-white w-36">{string}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
