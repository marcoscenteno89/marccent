'use client';
import { DataTable } from 'marccent-theme/components/ui/data-table';
import { Rating, Stars } from 'marccent-theme/components/ui/rating';
import { TagInput } from 'marccent-theme/components/ui/tag-input';
import { Compare } from 'marccent-theme/components/ui/compare';
import { Section, Collage, Tile } from '@/components/gallery';
import { img } from '@/lib/img';

/*
 * The Inputs & data section of the widgets gallery: DataTable, Rating and Stars, TagInput and Compare. Client side:
 * DataTable's columns can hold functions.
 */

const CITIES = [ 'Boise', 'Reno', 'Austin', 'Denver' ];
const TEAM = [ 'Ana', 'Ben', 'Cy', 'Dee', 'Eli', 'Fay', 'Gus', 'Hal', 'Ivy', 'Jo', 'Kai', 'Lu' ].map((name, i) => ({
  id: name,
  name,
  role: [ 'Design', 'Build', 'Test' ][i % 3],
  city: CITIES[i % 4],
  score: 60 + ((i * 17) % 40),
}));

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'city', label: 'City' },
  { key: 'score', label: 'Score', align: 'end', render: (row) => <strong>{row.score}</strong> },
];

const MoreWidgets = () => (
  <Section name="Inputs & data" intro="components/ui: a table to sort, filter and page, star ratings, a tag field and a before/after slider. Each has a plain-JS twin in core/ for server-rendered pages.">
    <Collage>
      <Tile name="DataTable" text="Click a header to sort (again to reverse, a third time to reset); type to filter" size="full">
        <DataTable label="Team" rows={TEAM} columns={COLUMNS} pageSize={5} />
      </Tile>
      <Tile name="Rating" text="Radio buttons under the stars: arrow keys work and a form post sends the score" size="wide">
        <div className="grid cols-1 gap-sm">
          <Rating name="talk" label="Rate the talk" defaultValue={4} />
          <Rating name="love" label="How much" icon="heart" max={3} />
        </div>
      </Tile>
      <Tile name="Stars" text="A score to read, fractions included: 3.5 out of 5" size="wide">
        <Stars value={3.5} />
      </Tile>
      <Tile name="TagInput" text="Enter or a comma adds a tag, Backspace removes the last; up to 6" size="full">
        <TagInput name="skills" defaultValue={[ 'CSS', 'React' ]} suggestions={[ 'Django', 'Python', 'Next.js', 'Canvas' ]} max={6} />
      </Tile>
      <Tile name="Compare" text="Drag the handle, or focus it and use the arrow keys" size="full">
        <Compare className="round" style={{ aspectRatio: '16 / 7' }}
          before={<img src={img('blue1')} alt="The photo in black and white" style={{ filter: 'grayscale(1)' }} />}
          after={<img src={img('blue1')} alt="The photo in color" />} />
      </Tile>
    </Collage>
  </Section>
);

export { MoreWidgets };
