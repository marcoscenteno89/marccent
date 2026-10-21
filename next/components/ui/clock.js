'use client';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// Live clock, updated every second. format is a dayjs format string.
const Clock = ({ format = 'h:mm:ss A', className = '' }) => {
  const [ time, setTime ] = useState(dayjs());
  useEffect(() => {
    const interval = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);
  return <time className={className} dateTime={time.toISOString()}>{time.format(format)}</time>;
}

export { Clock };
