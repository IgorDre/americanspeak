'use client';
import { motion } from 'framer-motion';

const bars = [4, 8, 13, 17, 12, 7, 15, 10, 5, 14, 9, 16, 6, 13, 11, 8, 15, 7, 12, 10, 14, 6];

export function WaveformVisualizer({ isPlaying, isSlow }: { isPlaying: boolean; isSlow?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      height: '28px',
      gap: '3px',
      overflow: 'hidden',
    }}>
      {bars.map((baseH, i) => (
        <motion.div
          key={i}
          animate={isPlaying ? {
            height: [`${baseH}px`, `${baseH * 2.2}px`, `${baseH}px`],
            opacity: [0.6, 1, 0.6],
          } : {
            height: `${baseH}px`,
            opacity: 0.5,
          }}
          transition={{
            duration: 0.5 + (i % 3) * 0.15,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
          style={{
            width: '3px',
            minWidth: '3px',
            flexShrink: 0,
            borderRadius: '999px',
            background: 'var(--ring-text)',
          }}
        />
      ))}
    </div>
  );
}
