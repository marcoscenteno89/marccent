'use client';
import { useState, useEffect, useContext, useRef } from 'react';
import { useInView } from '@/lib/in-view';
import { Button } from '@/components/ui/button';
import { RadialMenu } from '@/components/widgets/nav';
import { Radar, Speedometer } from '@/components/widgets/data';
import { Calendar, Scheduler } from '@/components/widgets/calendar';
import dayjs from 'dayjs';
import { reducedMotion } from '@/components/visuals/effects';
import { ToastContext } from '@/lib/context';

/*
 * The Widgets page's demos that need state or the toast: a radial menu that says what was picked, a radar with a
 * shuffle button and a speedometer that wanders.
 */

const RadialMenuDemo = () => {
  const { toast, setToast } = useContext(ToastContext) ?? {};
  const say = (msg) => toast && setToast(toast.add(msg, 'info'));
  const items = [ [ 'house', 'Home' ], [ 'user', 'Profile' ], [ 'gear', 'Settings' ], [ 'bell', 'Alerts' ], [ 'envelope', 'Messages' ], [ 'heart', 'Likes' ] ]
    .map(([ icon, label ]) => ({ icon, label, onClick: () => say(label) }));
  return <RadialMenu items={items} />;
}

const SKILLS = [ 'Design', 'Code', 'Speed', 'Access', 'Motion', 'Tests' ];
const random = () => Math.round(35 + Math.random() * 65);

const RadarDemo = () => {
  const [ values, setValues ] = useState([ 90, 80, 65, 85, 70, 60 ]);
  return (
    <div className="grid cols-1 gap-sm justify-center">
      <Radar axes={SKILLS.map((label, i) => ({ label, value: values[i] }))} className="w-100" style={{ maxWidth: '22rem' }} />
      <Button icon="shuffle" onClick={() => setValues(SKILLS.map(random))}>Shuffle</Button>
    </div>
  );
}

const SpeedometerDemo = () => {
  const [ value, setValue ] = useState(62);
  const box = useRef(null);
  const inView = useInView(box); // wanders only while on screen
  useEffect(() => {
    if (reducedMotion() || !inView) return;
    const t = setInterval(() => setValue(v => Math.min(Math.max(v + (Math.random() - .45) * 40, 0), 120)), 2000);
    return () => clearInterval(t);
  }, [ inView ]);
  return <div ref={box} className="w-100 col-center"><Speedometer value={value} max={120} unit="km/h" label="Speed" className="w-100" style={{ maxWidth: '18rem' }} /></div>;
}

// Events spread round today (worked out in the browser, so they're always near the visitor's today).
const useEvents = () => {
  const [ events, setEvents ] = useState([]);
  useEffect(() => {
    const t = dayjs().startOf('day');
    setEvents([
      { date: t.hour(9).minute(30).format(), title: 'Stand-up', color: 'bg-primary' },
      { date: t.hour(14).format(), title: 'Design review', color: 'bg-secondary' },
      { date: t.add(2, 'day').hour(11).format(), title: 'Ship the widgets', color: 'bg-success' },
      { date: t.add(5, 'day').format(), title: 'Theme day off', color: 'bg-danger' },
      { date: t.add(9, 'day').hour(16).format(), title: 'Shapes talk', color: 'bg-info' },
      { date: t.subtract(3, 'day').hour(10).format(), title: 'Honeycomb sketch', color: 'bg-secondary' },
      { date: t.add(1, 'month').startOf('month').add(2, 'day').format(), title: 'Next month kickoff', color: 'bg-primary' },
    ]);
  }, []);
  return events;
};

const CalendarDemo = () => {
  const events = useEvents();
  return <Calendar events={events} />;
}

// A booking range: Monday weeks with week numbers, nothing before today.
const RangeCalendarDemo = () => {
  const events = useEvents();
  const [ min, setMin ] = useState();
  useEffect(() => setMin(dayjs().format('YYYY-MM-DD')), []);
  return <Calendar mode="range" weekStart={1} weekNumbers min={min} events={events} />;
}

// A few openings already taken: tomorrow at 8 and 1, and the whole of the day after (so it can't be picked).
const SchedulerDemo = () => {
  const { toast, setToast } = useContext(ToastContext) ?? {};
  const [ booked, setBooked ] = useState([]);
  useEffect(() => {
    const t = dayjs().add(1, 'day').startOf('day'), t2 = t.add(1, 'day');
    setBooked([ t.hour(8), t.hour(13), t2.hour(8), t2.hour(10), t2.hour(13), t2.hour(15) ].map(d => d.format()));
  }, []);
  return <Scheduler booked={booked} onBook={(s) => toast && setToast(toast.add(`Booked ${s.start.format('ddd, MMM Do, h:mm A')}`, 'success'))} />;
}

export { RadialMenuDemo, RadarDemo, SpeedometerDemo, CalendarDemo, RangeCalendarDemo, SchedulerDemo };
