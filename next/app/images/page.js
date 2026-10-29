import { Icon } from 'marccent-theme/components/ui/icon';
import { GalleryHeader, Section } from '@/components/gallery';
import { Collage, Spinner, Light, Ghost, Stars, Progress } from 'marccent-theme/components/widgets/collage';
import { Clock } from 'marccent-theme/components/ui/clock';
import { Orbit } from 'marccent-theme/components/visuals/effects';
import { Atom, AnalogClock, FlipClock } from '@/components/widgets/fun';
import { LoopCountdown } from './live';

/*
 * Images gallery: one collage of every photo in public/img (named by their main color), each an ImageCard
 * (widgets/layout.js) of a different size, shape and overlay: squares, circles, portraits, landscapes, features and a
 * panorama, under a fade, frosted glass, a progressive blur, a focus blur or the theme tint. Some hold a moving widget:
 * an orbit, clocks, a countdown and loaders.
 */

export const metadata = { title: 'Images' };

// Every photo once. The sizes are picked so the 6-column grid fills with no holes (11 rows); the grid packs them densely.
const TILES = [
  { src: 'blue1', size: 'feature', overlay: 'focus', badge: 'New', align: 'center',
    children: <div className="w-100" style={{ maxWidth: '20rem' }}><Orbit autoPlay interval={2500} items={[
      { icon: <Icon name="fish" />, title: 'Reef', text: 'Seagrass at six meters.' },
      { icon: <Icon name="water" />, title: 'Currents', text: 'Slack tide at noon.' },
      { icon: <Icon name="anchor" />, title: 'Moorings', text: 'Twelve buoys, no anchors.' },
      { icon: <Icon name="sailboat" />, title: 'Boats', text: 'Three trips a day.' },
      { icon: <Icon name="compass" />, title: 'Routes', text: 'Four dive sites.' },
    ]} /></div> },
  { src: 'orange1', size: 'square', border: 'frame', title: 'Citrus' },
  { src: 'purple1', size: 'circle', border: 'accent', overlay: 'blur', label: 'Wildflowers', title: 'Fireweed' },
  { src: 'pink2', size: 'portrait', overlay: 'focus', label: 'Lakeside', title: 'Purple hour', text: 'Ten minutes after sunset, mirrored.' },
  { src: 'yellow2', size: 'landscape', overlay: 'blur', label: 'Hills', title: 'Morning haze', children: <Light icon="route">Route</Light> },
  { src: 'black1', size: 'square', align: 'center', border: 'line',
    children: <div className="grid cols-1 gap-xs justify-center"><Atom style={{ width: '5.5rem' }} /><small>4,000 stars tonight</small></div> },
  { src: 'teal2', size: 'portrait', overlay: 'glass', badge: '-20%', label: 'Seychelles', title: 'Turquoise bays', children: <Light icon="plane">Book</Light> },
  { src: 'red1', size: 'circle', border: 'frame', title: 'Red leaves' },
  { src: 'white1', size: 'wide', overlay: 'glass', align: 'center', label: 'Winter', title: 'Frost melts at sunrise',
    // The digits scale with the width they get (cqi of the wrapper), at most 3rem.
    children: <div className="cq w-100 col-center"><FlipClock size="min(3rem, 14cqi)" /></div> },
  { src: 'brown2', size: 'square', border: 'line', overlay: 'blur', title: 'Ferns in fall' },
  { src: 'blue6', size: 'portrait', overlay: 'focus', label: 'Deep sea', title: 'Moon jellyfish', text: '95% water, no brain, 500 million years old.', children: <Ghost icon="play" label="Watch" /> },
  { src: 'green1', size: 'landscape', label: 'Parks', title: 'Under the oaks', text: 'Bring a blanket.', children: [<Light key="p" icon="basket-shopping">Plan a picnic</Light>, <Ghost key="m" icon="map-location-dot" label="Map" />] },
  { src: 'gray1', size: 'square', border: 'frame', overlay: 'tint', label: 'Monochrome', title: 'Snowfield' },
  { src: 'orange5', size: 'circle', overlay: 'tint', title: 'Pine sunset' },
  { src: 'yellow1', size: 'square', overlay: 'glass', align: 'center', title: 'Rapeseed', children: <Stars n={5} /> },
  { src: 'teal3', size: 'feature', overlay: 'blur', badge: '4.2 km', label: 'Alpine', title: 'Glacier lake', text: 'Milky blue from rock flour. Two hours up, one down.',
    children: [<Progress key="p" value={68} label="Season's trail progress" />, <Light key="h" icon="person-hiking">Hike it</Light>, <Ghost key="s" icon="share-nodes" label="Share" />] },
  { src: 'pink3', size: 'square', border: 'accent', overlay: 'focus', title: 'Carnations' },
  { src: 'red2', size: 'portrait', label: 'Close up', title: 'Berries and leaves', text: 'Autumn at macro scale.', children: <Ghost icon="heart" label="Save" /> },
  { src: 'white3', size: 'landscape', overlay: 'tint', align: 'center', title: 'The lone tree', children: <q className="fs-sm" style={{ opacity: .9 }}>It leans, but it stays.</q> },
  { src: 'blue5', size: 'square', border: 'line', badge: 'Live', align: 'center', label: 'Ridge time',
    children: <Clock format="h:mm:ss A" className="h4 fw-bold" /> },
  { src: 'orange2', size: 'circle', border: 'frame', overlay: 'glass', title: 'Blood oranges' },
  { src: 'green2', size: 'landscape', overlay: 'glass', label: 'Orchard', title: 'Summer canopy', children: [<Stars key="s" n={4} />, <Light key="v" icon="tree">Visit</Light>] },
  { src: 'brown1', size: 'portrait', overlay: 'blur', label: 'Wetlands', title: 'Reeds', text: 'Gold in October.' },
  { src: 'blue2', size: 'wide', overlay: 'blur', big: true, label: 'Coast', title: 'Blue hour on the rocks', children: <Light icon="camera">Prints</Light> },
  { src: 'pink4', size: 'landscape', border: 'line', title: 'Blossoms', badge: 'Spring' },
  { src: 'orange6', size: 'circle', overlay: 'focus', label: 'Ripe in', children: <LoopCountdown from={9} style={{ '--countdown-size': '3rem' }} /> },
  { src: 'yellow3', size: 'landscape', overlay: 'glass', align: 'start', label: 'Valley', title: 'Sunflower fields', text: 'Counting the harvest…',
    children: <Spinner kind="dots" width="3rem" /> },
  { src: 'white2', size: 'square', overlay: 'blur', title: 'Snow pines' },
  { src: 'red3', size: 'portrait', overlay: 'tint', align: 'start', label: 'Dusk', title: 'Red sky at night', children: <q className="fs-sm">Sailors&apos; delight.</q> },
  { src: 'teal1', size: 'circle', overlay: 'focus', border: 'accent', title: 'Forecast', children: <Spinner kind="ring" width="2.5rem" /> },
  { src: 'orange3', size: 'landscape', badge: 'Golden hour', label: 'Fields', title: 'First light', children: <Ghost icon="sun" label="Sunrise times" /> },
  { src: 'brown3', size: 'portrait', border: 'line', overlay: 'glass', align: 'center', title: 'Frosted reeds' },
  { src: 'blue4', size: 'portrait', overlay: 'focus', align: 'center', label: 'Night', title: 'The still lake', text: 'Tours start at nine.',
    children: [<AnalogClock key="c" style={{ width: 'min(100%, 8rem)' }} />, <Light key="t" icon="moon">Night tours</Light>] },
  { src: 'pink1', size: 'landscape', overlay: 'blur', label: 'Garden', title: 'Lavender', children: <Stars n={5} /> },
  { src: 'blue3', size: 'landscape', border: 'frame', overlay: 'tint', title: 'Bay light' },
  { src: 'orange4', size: 'panorama', overlay: 'glass', align: 'center', label: 'Harvest', title: 'One tree, a sea of wheat',
    text: 'The last field before the hills.', children: [<Light key="f" icon="wheat-awn">Visit the farm</Light>, <Ghost key="s" icon="heart" label="Save" />] },
];

export default function ImagesPage() {
  return (
    <>
    <GalleryHeader title="Images" sections={['Collage']}>
      <p>Every photo in one collage: ImageCard in all its shapes (square, circle, portrait, landscape, feature, panorama) and overlays (fade, glass, blur, focus, tint).</p>
    </GalleryHeader>
    <div className="wrap grid cols-1 gap-lg pad-y-lg">

      <Section name="Collage" intro='Each tile is an ImageCard with ratio={null}: it fills its grid cell; the span-* classes and row spans make the sizes, and the grid packs them densely. Hover any of them.'>
        <Collage tiles={TILES} />
      </Section>
    </div>
    </>
  );
}
