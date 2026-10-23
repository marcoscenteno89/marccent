import { GalleryHeader, Section } from '@/components/gallery';
import { Collage, Light, Ghost, Stars, Progress } from 'marccent-theme/components/widgets/collage';
import { AnimPlayer } from 'marccent-theme/components/visuals/animations';
import { Clock } from 'marccent-theme/components/ui/clock';
import { FlipClock } from '@/components/widgets/fun';
import { ImageCard } from 'marccent-theme/components/widgets/layout';
import { Button } from 'marccent-theme/components/ui/button';

/*
 * Animations gallery: the canvas animations (components/visuals/canvas.js). A player (one large animation and a
 * slider to pick it), then a collage like the Images page's with live animations in place of the photos. Every canvas
 * is a data-canvas element (visuals/canvas-scanner.js): each runs only while on screen, the collage's at 30 fps.
 */

export const metadata = { title: 'Animations' };

// The collage tiles run a little slower than the player: there are several of them on screen at once.
const FPS = 30;

// Every animation at least once, on a 3-column grid of double-size cells (Collage cols / min / row), so each tile is
// four of the Images collage's cells: fewer canvases, each one larger. The sizes fill the grid with no holes (5 rows).
const TILES = [
  { canvas: 'blob', size: 'feature', overlay: 'glass', badge: 'Metaballs', label: 'Blob', title: 'Shapes that merge and split',
    text: 'Groups of blobs wander on smooth paths and swing apart now and then.', children: <Light icon="droplet">Soft shapes</Light> },
  { canvas: 'fire', size: 'square', border: 'frame', overlay: 'blur', badge: 'Hot', label: 'Fire', title: 'Campfire',
    children: <Stars n={5} /> },
  { canvas: 'snow', size: 'circle', border: 'accent', overlay: 'blur', title: 'Snow' },
  { canvas: 'wave', size: 'portrait', overlay: 'focus', label: 'Wave', title: 'Rolling tide', text: 'Layered waves in the theme colors.',
    children: <Ghost icon="water" label="Waves" /> },
  { canvas: 'network-loop', size: 'landscape', overlay: 'glass', label: 'Network', title: 'Points that link up',
    children: <Progress value={72} label="Links this second" /> },
  { canvas: 'orbit', size: 'square', border: 'line', badge: 'Live', align: 'center', label: 'Orbit time',
    children: <Clock format="h:mm:ss A" className="h4 fw-bold" /> },
  { canvas: 'particle-flowfield', size: 'square', overlay: 'tint', label: 'Flowfield', title: 'Dust on a current',
    text: 'A particle per pixel of the canvas side, steered by noise.', children: <Ghost icon="wind" label="Wind" /> },
  { canvas: 'snow', size: 'wide', overlay: 'glass', align: 'center', label: 'Winter', title: 'First snow',
    children: <div className="cq w-100 col-center"><FlipClock size="min(3rem, 14cqi)" /></div> },
].map((tile) => ({ fps: FPS, ...tile }));

// More photo + animation cards for the Card section, each animation on photos that suit it (it draws in the theme
// colors, unless the card gives its own: white snow and stars, red fire). Each card is ImageCard props plus a canvas,
// and differs from its neighbours in overlay, alignment, badge and content, so the section shows what ImageCard can do.
const CARDS = [
  { src: 'orange5', canvas: 'fire', colors: '#ff3d00, #ff6d00, #ff9100, #ffc400', badge: '$48 / night', label: 'Outback · Australia',
    title: 'Embers at sundown', text: 'A campfire under a burning sky, then a night of stars.',
    children: <><Light icon="fire">Pack the tent</Light><Ghost icon="heart" label="Save" /></> },
  { src: 'red3', canvas: 'fire', colors: '#ff1744, #ff3d00, #ff9100', overlay: 'glass', align: 'start', label: 'Highlands · Scotland',
    title: 'Last light', children: <Stars n={4} /> },
  { src: 'blue2', canvas: 'wave', colors: '#fff', overlay: 'blur', badge: 'High tide 18:40', label: 'Big Sur · California',
    title: 'Tide on the rocks', text: 'Watch the swell roll in over the black stones at dusk.' },
  { src: 'teal2', canvas: 'wave', colors: '#fff, #b2ebf2', overlay: 'focus', align: 'center', title: 'Turquoise bays',
    children: <Light icon="umbrella-beach">Set sail</Light> },
  { src: 'brown3', canvas: 'particle-flowfield', colors: '#fff, #ffe0b2', overlay: 'tint', label: 'Camargue · France',
    title: 'Reeds in the wind', children: <Progress value={64} label="Wind, km/h" /> },
  { src: 'gray1', canvas: 'particle-flowfield', colors: '#fff, #fff', overlay: 'glass', badge: '12k birds', label: 'Wadden Sea',
    title: 'Birds on the shore', text: 'Mist, sand and flocks resting before the long flight south.' },
  { src: 'yellow1', canvas: 'particle-flowfield', colors: '#fff9c4, #fff', align: 'start', label: 'Bavaria · Germany',
    title: 'Rapeseed in bloom', children: <><Ghost icon="seedling" label="Fields" /><Ghost icon="bicycle" label="Ride" /><Ghost icon="map" label="Map" /></> },
  { src: 'blue5', canvas: 'network-loop', colors: '#fff', overlay: 'focus', align: 'center', badge: 'Live', label: 'Atacama · Chile',
    title: 'Join the dots', children: <Clock format="h:mm A" className="h4 fw-bold" /> },
  { src: 'black1', canvas: 'network-loop', colors: '#fff', overlay: 'none', align: 'start', title: 'Into the dark',
    text: 'Points of light linking up across the night.' },
  { src: 'blue6', canvas: 'blob', colors: '#80deea, #b388ff', overlay: 'glass', badge: '-15%', label: 'Great Barrier Reef',
    title: 'Jellyfish drift', children: <Light icon="droplet">Dive in</Light> },
  { src: 'blue4', canvas: 'snow', colors: '#fff', overlay: 'blur', badge: '-9°C', label: 'Lake Tekapo · New Zealand',
    title: 'Snow at dusk', children: <Stars n={5} /> },
  { src: 'green1', canvas: 'fireflies', overlay: 'tint', align: 'center', label: 'Black Forest · Germany', title: 'Fireflies at dusk',
    text: 'A summer evening walk under the oaks as the meadow lights up.' },
  { src: 'green2', canvas: 'fireflies', badge: '3 spots left', label: 'Ozarks · Missouri', title: 'Glow in the grove',
    children: <Progress value={88} label="Booked" /> },
  { src: 'green2', canvas: 'leaves', colors: '#c62828, #d84315, #ff7043, #ffb300', overlay: 'glass', align: 'start', label: 'Vermont · USA',
    title: 'Leaf season', children: <Light icon="leaf">Take the trail</Light> },
  { src: 'yellow2', canvas: 'leaves', colors: '#fbc02d, #f9a825, #ef6c00, #a1887f', overlay: 'focus', badge: 'Harvest', title: 'Autumn hills',
    text: 'Vineyards turning gold, and a gust through the poplars.' },
  { src: 'blue3', canvas: 'rain', colors: '#fff', overlay: 'blur', align: 'center', label: 'Lake Geneva · Switzerland', title: 'Rain on the lake',
    children: <><Ghost icon="mug-hot" label="Cafés" /><Ghost icon="share-nodes" label="Share" /></> },
  { src: 'blue4', canvas: 'rain', colors: '#fff', overlay: 'tint', badge: '6 mm', label: 'Fjordland · New Zealand',
    title: 'Evening showers', text: 'Ripples across the still lake below the peaks.' },
  { src: 'teal3', canvas: 'rain', colors: '#fff', overlay: 'glass', align: 'start', title: 'Spring rain', children: <Stars n={3} /> },
  { src: 'blue6', canvas: 'bubbles', colors: '#fff', overlay: 'focus', align: 'center', badge: '18 m', title: 'Under the surface',
    children: <Light icon="fish">Dive in</Light> },
  { src: 'black1', canvas: 'bubbles', colors: '#fff', overlay: 'none', label: 'The deep', title: 'Rising up',
    children: <Progress value={40} label="Depth" /> },
].map((card) => ({ ...card, src: `/img/${card.src}.webp` }));

export default function AnimationsPage() {
  return (
    <div className="wrap grid cols-1 gap-lg">
      <GalleryHeader title="Animations" sections={['Player', 'Card', 'Collage']}>
        <p>The canvas animations: pick one to play it large, or see them all at once in a collage. Any element can run one with a data-canvas attribute (&quot;blob&quot;, &quot;snow&quot;…).</p>
      </GalleryHeader>

      <Section name="Player" intro="The large animation plays the card picked in the slider below; every card runs its own preview.">
        <AnimPlayer />
      </Section>

      <Section name="Card" intro='An animation over a photo: ImageCards with both src and canvas, so it plays behind the text. Snow on winter photos first, then each animation on photos that suit it, every card with its own overlay, layout and content.'>
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '18rem' }}>
          <ImageCard src="/img/white2.webp" canvas="snow" colors="#fff" badge="-4°C" label="Lapland · Finland" title="First snow in the pines"
            text="Three nights in a timber cabin at the edge of the forest, with a sauna and a sky full of stars.">
            <Button icon="snowflake" className="light">Book a stay</Button>
            <Button icon="heart" className="light" aria-label="Save" />
          </ImageCard>
          <ImageCard src="/img/white3.webp" canvas="snow" colors="#fff" overlay="focus" position="30% center" badge="New" label="Hokkaido · Japan" title="The lone tree"
            text="A winter photo walk across the open fields at dawn, before the wind picks up.">
            <Button icon="camera" className="light">Join the walk</Button>
          </ImageCard>
          <ImageCard src="/img/white1.webp" canvas="snow" colors="#fff" badge="2 days" label="Dolomites · Italy" title="Frost on the ridge"
            text="A guided hike through the frozen beech woods, with hot chocolate at the hut on top.">
            <Button icon="person-hiking" className="light">See the route</Button>
            <Button icon="share-nodes" className="light" aria-label="Share" />
          </ImageCard>
          {CARDS.map((card) => <ImageCard key={`${card.src}-${card.canvas}`} {...card} />)}
        </div>
      </Section>

      <Section name="Collage" intro='The Images collage with live animations instead of photos: each tile is an ImageCard with canvas="…", in every size, border and overlay; its cells are twice as big as on the Images page, so each tile is four times the area. Hover any of them.'>
        <Collage tiles={TILES} cols={3} min="18rem" row="22rem" />
      </Section>
    </div>
  );
}
