import { Button } from '@/components/ui/button';
import { GalleryHeader, Section, Demo } from '@/components/gallery';
import { Scenery, SCENERY_PATHS } from '@/components/visuals/scenery';

/*
 * Parallax gallery: the Scenery layers (visuals/scenery.js) one by one and the full-screen landscapes built from
 * them. Its own page, since the scenes are a screen tall each. All hold still for visitors who ask for reduced motion.
 */

export const metadata = { title: 'Parallax' };

// Skies for the scenes, tinted from the theme and the page color, so they follow the mode like the layers do.
const SKY = {
  day: 'linear-gradient(var(--body-bg), color-mix(in srgb, var(--secondary) 22%, var(--body-bg)))',
  dusk: 'linear-gradient(color-mix(in srgb, var(--primary) 18%, var(--body-bg)), color-mix(in srgb, var(--secondary) 30%, var(--body-bg)))',
  night: 'linear-gradient(color-mix(in srgb, var(--primary) 22%, var(--body-bg)), var(--body-bg))',
};

// The full-screen Scenery sections: layers back to front, sky kinds first; each one gets its own depth level, the back one
// nearly the page color, the front one nearly the text color.
const SCENES = [
  { name: 'Night in the mountains', note: 'stars, moon, far ranges, peaks, hills, pines and a stag', sky: SKY.night,
    layers: [ 'stars', 'moon', 'ranges', 'mountains', 'hills', 'forest' ],
    children: <Button icon="arrow-down" href="#city" className="gradient">Start climbing</Button> },
  { name: 'City', note: 'clouds, a far skyline and bridge, two skylines, the street', sky: SKY.day, layers: [ 'clouds', 'birds', 'farcity', 'city', 'city', 'street' ] },
  { name: 'Grand Canyon', note: 'sun, wisps, far mesas, the canyon, the rim', sky: SKY.dusk, layers: [ 'sun', 'wisps', 'birds', 'mesas', 'canyon', 'canyon', 'rim' ] },
  { name: 'Monument Valley', note: 'stars, moon, mesas, buttes, dunes, cacti', sky: SKY.night, layers: [ 'stars', 'moon', 'mesas', 'buttes', 'dunes', 'cactus' ] },
  { name: 'Pine forest', note: 'clouds, far ranges, snowy peaks, rows of pines', sky: SKY.day, layers: [ 'clouds', 'ranges', 'mountains', 'forest', 'forest' ] },
  { name: 'Woods', note: 'sun, birds, a far treeline, hills, broadleaf trees, a meadow', sky: SKY.dusk, layers: [ 'sun', 'birds', 'treeline', 'hills', 'trees', 'meadow' ] },
  { name: 'Countryside', note: 'balloons, a far treeline, hills, the farm, a meadow', sky: SKY.day, layers: [ 'wisps', 'balloons', 'treeline', 'hills', 'farm', 'meadow' ] },
  { name: 'Desert', note: 'sun, birds, far mesas, dunes, cacti and a coyote', sky: SKY.dusk, layers: [ 'sun', 'birds', 'mesas', 'dunes', 'dunes', 'cactus' ] },
  { name: 'Coast', note: 'sun, clouds, far ranges, the open sea, surf, the beach', sky: SKY.day, layers: [ 'sun', 'clouds', 'birds', 'ranges', 'waves', 'surf', 'beach' ] },
  { name: 'Tropical beach', note: 'sun, wisps, the sea, surf, palms, the beach', sky: SKY.dusk, layers: [ 'sun', 'wisps', 'waves', 'surf', 'palms', 'beach' ] },
  { name: 'Sea cliffs', note: 'moon, birds, the sea, cliffs, breaking surf', sky: SKY.night, layers: [ 'moon', 'birds', 'waves', 'cliffs', 'cliffs', 'surf' ] },
];

const SECTIONS = ['Scenery'];

export default function ParallaxPage() {
  return (
    <>
    <div className="wrap grid cols-1 gap-lg">
      <GalleryHeader title="Parallax" sections={SECTIONS}>
        <p>Silhouette layers that stack into landscapes, scrolled through full screen: far layers drift, near ones hold.</p>
      </GalleryHeader>

      <Section name="Scenery" intro="components/visuals/scenery.js: neutral silhouette layers (the text color mixed into the page color: the front layer nearly the text color, the back one nearly the page color, the ones between spread evenly) to stack into parallax landscapes; they work in light and dark mode and with any theme. The full-screen scenes below combine them: scroll through, far layers drift, near ones hold.">
        <Demo name="Layers">Each one alone</Demo>
        <div className="grid gap-sm" style={{ '--cols': 4, '--min': '12rem' }}>
          {Object.keys(SCENERY_PATHS).map(kind => (
            <div key={kind} className="grid cols-1 gap-sm">
              <Scenery layers={[ kind ]} height="7rem" parallax={false} className="round border" />
              <small className="opacity-75">{kind}</small>
            </div>
          ))}
        </div>
      </Section>
    </div>

    {/* The scenes: full width and full screen height, each its own section (watched by PauseOffscreen), stacked with
        no gap so one landscape runs straight into the next. */}
    <div className="grid cols-1 gap-0">
    {SCENES.map(({ name, note, layers, sky, children }) => (
      <section key={name} id={name.toLowerCase().replace(/ /g, '-')} className="wrap wrap-fluid pad-0">
        <Scenery layers={layers} height="100vh" min="40vh" style={{ background: sky }}>
          <small className="text-uppercase fw-bold text-primary" style={{ letterSpacing: '.25em' }}>{note}</small>
          <h2 className="display-lg">{name}</h2>
          {children}
        </Scenery>
      </section>
    ))}
    </div>
    </>
  );
}
