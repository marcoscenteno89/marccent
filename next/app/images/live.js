'use client';
// The images page's moving pieces that need state: a countdown that starts over once it reaches 0.
import { useState } from 'react';
import { Countdown } from '@/components/visuals/effects';

/** LoopCountdown: Countdown from `from` to 0, then again (a new key remounts it). */
const LoopCountdown = ({ from = 9, style }) => {
  const [ round, setRound ] = useState(0);
  return <Countdown key={round} from={from} onDone={() => setRound(r => r + 1)} style={style} />;
};

export { LoopCountdown };
