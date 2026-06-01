'use client';
import { motion } from 'framer-motion';

const DURATION = 2.0;

function Char({ char, delay }: { char: string; delay: number }) {
  return (
    <motion.span
      animate={{ opacity: [0.1, 1, 0.1] }}
      transition={{ duration: DURATION, repeat: Infinity, delay, ease: 'easeInOut' }}
      style={{
        color: 'var(--ring-text)',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: 1,
        display: 'inline-block',
      }}
    >
      {char}
    </motion.span>
  );
}

export function SwipeHints() {
  // ‹‹‹ skip — wave RIGHT→LEFT: p fires first (d=0), leftmost ‹ fires last (d=0.66)
  const skipItems = [
    { c: '‹', d: 0.66 }, // leftmost
    { c: '‹', d: 0.55 }, // middle
    { c: '‹', d: 0.44 }, // rightmost (adjacent to word)
    { c: ' ', d: 0 },
    { c: 's', d: 0.33 },
    { c: 'k', d: 0.22 },
    { c: 'i', d: 0.11 },
    { c: 'p', d: 0.00 }, // rightmost char — fires first
  ];

  // learn ››› — wave LEFT→RIGHT: l fires first (d=0), rightmost › fires last (d=0.77)
  const learnItems = [
    { c: 'l', d: 0.00 }, // leftmost char — fires first
    { c: 'e', d: 0.11 },
    { c: 'a', d: 0.22 },
    { c: 'r', d: 0.33 },
    { c: 'n', d: 0.44 },
    { c: ' ', d: 0 },
    { c: '›', d: 0.55 }, // leftmost chevron (adjacent to word)
    { c: '›', d: 0.66 }, // middle
    { c: '›', d: 0.77 }, // rightmost — fires last
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '0',
      margin: '0',
      userSelect: 'none',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
        {skipItems.map((item, i) =>
          item.c === ' '
            ? <span key={i} style={{ width: '4px' }} />
            : <Char key={i} char={item.c} delay={item.d} />
        )}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
        {learnItems.map((item, i) =>
          item.c === ' '
            ? <span key={i} style={{ width: '4px' }} />
            : <Char key={i} char={item.c} delay={item.d} />
        )}
      </span>
    </div>
  );
}
