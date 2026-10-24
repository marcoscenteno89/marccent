import { Icon } from 'marccent-theme/components/ui/icon';
import { GalleryHeader, Section, Collage, Tile } from '@/components/gallery';
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
// Collage sizes for some shapes (the rest are one cell), picked to suit each shape and fill the 8-column grid, and how
// wide the shape is drawn in each size.
const SHAPE_SIZE = { hexagon: 'big', star: 'big', heart: 'big', blob: 'big', ellipse: 'wide', pill: 'wide',
  parallelogram: 'wide', 'arrow-right': 'wide', ribbon: 'wide', semicircle: 'wide', trapezoid: 'wide',
  'chevron-right': 'wide', ticket: 'wide', egg: 'tall', teardrop: 'tall', triangle: 'tall', leaf: 'tall' };
const SHAPE_WIDTH = { big: '9rem', wide: '9rem', tall: '5rem' };

export default function ShapesPage() {
  return (
    <div className="wrap grid cols-1 gap-lg">
      <GalleryHeader title="Shapes" sections={SECTIONS}>
        <p>Cut any element to a shape with one class, or tile hexagons into a honeycomb, each section a collage.</p>
      </GalleryHeader>

      <Section name="Shapes" intro="utilities.css: a .shape-* class cuts any element to that shape; a width sizes it, the shape sets its proportions.">
        <Collage cols={8} min="7rem" row="8rem">
          {SHAPES.map(name => (
            <Tile key={name} name={name} size={SHAPE_SIZE[name]}>
              <div className="col-center">
                <div className={`shape-${name} bg-gradient`} style={{ width: SHAPE_WIDTH[SHAPE_SIZE[name]] ?? '4rem', '--notch': '.5rem' }} />
              </div>
            </Tile>
          ))}
        </Collage>
        <Collage>
          <Tile name="Icon in a hexagon" text="Any content sits in the middle of a shape">
            <div className="col-center"><div className="shape-hexagon bg-primary col-center" style={{ width: '6rem' }}><Icon name="cube" className="fs-lg" /></div></div>
          </Tile>
          <Tile name="Bubble" text="A speech bubble holds its own text">
            <div className="col-center"><div className="shape-bubble bg-secondary col-center text-center" style={{ width: '8rem', paddingBottom: '25%' }}>Hello!</div></div>
          </Tile>
          <Tile name="Ring" text="A custom hole with --ring-hole">
            <div className="col-center"><div className="shape-ring bg-gradient" style={{ width: '6rem', '--ring-hole': '80%' }} /></div>
          </Tile>
          <Tile name="Heart" text="Any color class fills it">
            <div className="col-center"><div className="shape-heart bg-danger" style={{ width: '5.5rem' }} /></div>
          </Tile>
          <Tile name="Ticket" text="Wide, with content: aspect-ratio auto and padding instead" size="wide">
            <div className="shape-ticket bg-primary-lighter col-center text-center pad" style={{ aspectRatio: 'auto', '--notch': '1.25rem' }}>
              <strong>Admit one</strong><small>Row 4 · Seat 12</small>
            </div>
          </Tile>
          <Tile name="Wave" text="A section with a wavy edge: a height instead of a ratio" size="wide">
            <div className="shape-wave bg-gradient col-center" style={{ aspectRatio: 'auto', height: '7rem' }}>
              <strong>Section header</strong>
            </div>
          </Tile>
        </Collage>
      </Section>

      <Section name="Honeycomb" intro="HexGrid (components/widgets/layout.js) places .shape-hexagon tiles on a grid. Every row track is a quarter of a hexagon; each hexagon spans four, and each row of hexagons starts three tracks below the last, so the rows interlock. Every other row starts one column in; labels hide on phones (.icon-only-sm).">
        <Collage cols={3} min="18rem">
          <Tile name="Honeycomb" text="18 hexagons, five a row, every other row one column in" size="wide">
            <HexGrid perRow={HEX_ROW} className="w-100" style={{ maxWidth: '44rem', justifySelf: 'center' }}>
              {HONEYCOMB.map(([icon, label], i) => (
                <div key={label} className={`shape-hexagon col-center text-center icon-only-sm ${['bg-primary', 'bg-gradient', 'bg-secondary', 'bg-gradient-darker'][i % 4]}`}>
                  <Icon name={icon} className="fs-lg" />
                  <small className="btn-text">{label}</small>
                </div>
              ))}
            </HexGrid>
              </Tile>
              <Tile name="A flower" text="One hexagon in the center and one on each of its six sides">
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
          </Tile>
        </Collage>
      </Section>
    </div>
  );
}
