import { Icon } from 'marccent-theme/components/ui/icon';
import { GalleryHeader, Section, Demo } from '@/components/gallery';
import { HexGrid } from 'marccent-theme/components/widgets/layout';
import 'marccent-theme/styles/components/button.css';

/*
 * Shapes gallery: every .shape-* class (utilities.css) and honeycombs built from hexagons on a grid. The hovers made
 * for shapes are on the theme page, with every other hover. A server page: shapes are CSS only.
 */

export const metadata = { title: 'Shapes' };

// Every .shape-* class in utilities.css, for the Shapes section.
const SHAPES = ['circle', 'ellipse', 'semicircle', 'triangle', 'triangle-down', 'triangle-left', 'triangle-right', 'diamond',
  'pentagon', 'hexagon', 'hexagon-flat', 'octagon', 'star', 'cross', 'bevel', 'parallelogram', 'trapezoid', 'arrow-right',
  'arrow-left', 'chevron-right', 'chevron-left', 'tag', 'bubble', 'heart', 'ring', 'blob', 'egg', 'pill', 'quarter', 'leaf',
  'squircle', 'teardrop', 'moon', 'ribbon', 'bookmark', 'ticket', 'slant', 'wave', 'frame'];
// Icon and label for each Honeycomb tile.
const HONEYCOMB = [['house', 'Home'], ['user', 'About'], ['code', 'Code'], ['palette', 'Design'], ['camera', 'Photos'],
  ['music', 'Music'], ['book', 'Reading'], ['gamepad', 'Games'], ['chart-line', 'Stocks'], ['cloud-sun', 'Weather'],
  ['map', 'Map'], ['envelope', 'Contact'], ['flask', 'Labs'], ['rocket', 'Projects'], ['heart', 'Likes'],
  ['star', 'Favorites'], ['bolt', 'Fast'], ['leaf', 'Nature']];
const HEX_ROW = 5; // hexagons a row
// The flower: [row, column] of each hexagon for HexGrid (column in half hexagons): two on top, three in
// the middle (the center one between them), two below. Index 3 is the center.
const HEX_FLOWER = [[0, 1], [0, 3], [1, 0], [1, 2], [1, 4], [2, 1], [2, 3]];
const SECTIONS = ['Shapes', 'Honeycomb'];

export default function ShapesPage() {
  return (
    <div className="wrap grid cols-1 gap-lg">
      <GalleryHeader title="Shapes" sections={SECTIONS}>
        <p>Cut any element to a shape with one class, or tile hexagons into a honeycomb.</p>
      </GalleryHeader>

      <Section name="Shapes" intro="utilities.css: a .shape-* class cuts any element to that shape; a width sizes it, the shape sets its proportions.">
        <div className="grid gap-sm" style={{ '--cols': 8, '--min': '6rem' }}>
          {SHAPES.map(name => (
            <div key={name} className="sub rows-2 gap-y-sm justify-center text-center">
              <div className={`shape-${name} bg-gradient self-end`} style={{ width: '4.5rem', '--notch': '.5rem' }} />
              <small className="opacity-75">{name}</small>
            </div>
          ))}
        </div>
        <Demo name="Content in shapes">An icon in a hexagon, text in a bubble, and a ring with a custom hole (--ring-hole)</Demo>
        <div className="grid gap-lg items-center justify-center" style={{ '--cols': 4, '--min': '8rem' }}>
          <div className="shape-hexagon bg-primary col-center" style={{ width: '7rem' }}><Icon name="cube" className="fs-lg" /></div>
          <div className="shape-bubble bg-secondary col-center text-center" style={{ width: '9rem', paddingBottom: '25%' }}>Hello!</div>
          <div className="shape-ring bg-gradient" style={{ width: '6rem', '--ring-hole': '80%' }} />
          <div className="shape-heart bg-danger" style={{ width: '6rem' }} />
        </div>
        <Demo name="Wide shapes">A ticket with content, and a section with a wavy edge (aspect-ratio: auto, a height instead)</Demo>
        <div className="grid gap-lg" style={{ '--cols': 2 }}>
          <div className="shape-ticket bg-primary-lighter col-center text-center pad" style={{ aspectRatio: 'auto', '--notch': '1.25rem' }}>
            <strong>Admit one</strong><small>Row 4 · Seat 12</small>
          </div>
          <div className="shape-wave bg-gradient col-center" style={{ aspectRatio: 'auto', height: '8rem' }}>
            <strong>Section header</strong>
          </div>
        </div>
      </Section>

      <Section name="Honeycomb" intro="HexGrid (components/widgets/layout.js) places .shape-hexagon tiles on a grid. Every row track is a quarter of a hexagon; each hexagon spans four, and each row of hexagons starts three tracks below the last, so the rows interlock. Every other row starts one column in; labels hide on phones (.icon-only-sm).">
        <HexGrid perRow={HEX_ROW} className="w-100" style={{ maxWidth: '44rem', justifySelf: 'center' }}>
          {HONEYCOMB.map(([icon, label], i) => (
            <div key={label} className={`shape-hexagon col-center text-center icon-only-sm ${['bg-primary', 'bg-gradient', 'bg-secondary', 'bg-gradient-darker'][i % 4]}`}>
              <Icon name={icon} className="fs-lg" />
              <small className="btn-text">{label}</small>
            </div>
          ))}
        </HexGrid>
        <Demo name="A flower">One hexagon in the center and one on each of its six sides</Demo>
        <HexGrid at={HEX_FLOWER} className="w-100" style={{ maxWidth: '24rem', justifySelf: 'center' }}>
          {HEX_FLOWER.map((_, i) => {
            const [icon, label] = i === 3 ? ['hexagon-nodes', 'Center'] : HONEYCOMB[i];
            return (
              <div key={label} className={`shape-hexagon col-center text-center icon-only-sm ${i === 3 ? 'bg-gradient' : 'bg-primary-darker'}`}>
                <Icon name={icon} className="fs-lg" />
                <small className="btn-text">{label}</small>
              </div>
            );
          })}
        </HexGrid>
      </Section>
    </div>
  );
}
