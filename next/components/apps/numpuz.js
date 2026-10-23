'use client';
import React, { useEffect } from "react";
import { Counter } from '@/components/ui/counter';
import { cx } from '@/lib/cx';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Board } from '@/components/ui/board';
import { Loading } from '@/components/ui/loading';
import { Grid } from "@/lib/grid_helper";
import { Store, useStore } from "@/lib/store";

/*
 * Number puzzle (15-puzzle): slide tiles into the gap until they read 1, 2, 3… row by row, gap last. Click a
 * tile beside the gap, or drag it onto the gap (touch screens can't drag, so clicking always works). The board
 * is a grid_helper Grid whose cells stay put while their values move. NumPuzGame holds the game in plain JS; the
 * component only renders it.
 */

const SIZE = 4;

// The value cell i holds when solved: 1, 2, 3… and the gap (null) last.
const solvedValue = (grid, i) => (i === grid.size - 1 ? null : i + 1);

// Percent of cells in their solved place.
const progress = (grid) => Math.round(grid.cells.filter((cell, i) => cell.value === solvedValue(grid, i)).length / grid.size * 100);

/**
 * NumPuzGame: the puzzle's state and moves, in plain JS. Tile values move between cells in place and emit()
 * re-renders the component (useStore). No board until shuffle(): a random board rendered on the server wouldn't
 * match the browser's (hydration), so the component shuffles once mounted.
 */
class NumPuzGame extends Store {
  grid = null;

  // A solved board shuffled by sliding the gap around at random (never straight back). Shuffling the numbers
  // themselves gives an unsolvable board half the time; legal moves from the solved board can always be undone.
  shuffle() {
    const grid = new Grid(SIZE, SIZE, (row, col, i) => ({ row, col, value: i === SIZE * SIZE - 1 ? null : i + 1 }));
    let gap = grid.get(SIZE - 1, SIZE - 1);
    let previous = null;
    for (let move = 0; move < SIZE * SIZE * 30; move++) {
      const options = grid.neighbors(gap.row, gap.col, { diagonal: false }).filter((cell) => cell !== previous);
      const tile = options[Math.floor(Math.random() * options.length)];
      gap.value = tile.value;
      tile.value = null;
      previous = gap;
      gap = tile;
    }
    Object.assign(this, { grid, gap, active: false, won: false, status: '' });
    this.emit();
  }

  besideGap(cell) {
    return Math.abs(cell.row - this.gap.row) + Math.abs(cell.col - this.gap.col) === 1;
  }

  move(tile) {
    if (this.won || tile.value === null) return;
    if (!this.besideGap(tile)) {
      this.status = 'Invalid Move';
      return this.emit();
    }
    this.gap.value = tile.value;
    tile.value = null;
    this.gap = tile;
    const done = progress(this.grid);
    Object.assign(this, {
      active: done < 100, won: done === 100,
      status: done === 100 ? 'You won, Congratulations.' : `${done}% Completed`
    });
    this.emit();
  }

  // The Counter reports the time when it stops; only a solved puzzle shows it.
  showTime(time) {
    if (!this.won) return;
    this.status += ` Your time is ${time.hour} : ${time.minute} : ${time.second} : ${time.tos}`;
    this.emit();
  }
}

const NumPuz = () => {
  const game = useStore(() => new NumPuzGame());
  useEffect(() => game.shuffle(), []);
  if (!game.grid) return <Loading require={[]} />;
  const { grid, gap } = game;

  return (
    <div className="grid cols-1 gap-sm">
      <div className="grid fixed cols-2 items-center gap-sm pad border round">
        <Counter getTime={(time) => game.showTime(time)} active={game.active} />
        <Button onClick={() => game.shuffle()}>Start Over</Button>
      </div>
      <Board grid={grid} gap="4px">
        {(cell, i) => (
          <button type="button" key={i} className={cx('center round square', cell.value !== null && 'bg-primary')}
            draggable={!game.won && game.besideGap(cell)}
            onClick={() => game.move(cell)}
            onDragStart={(e) => e.dataTransfer.setData('text/plain', String(i))}
            onDragOver={(e) => cell === gap && e.preventDefault()} // only the gap accepts a drop
            onDrop={(e) => { e.preventDefault(); game.move(grid.cells[Number(e.dataTransfer.getData('text/plain'))]); }}>
            <span className="h2">{cell.value}</span>
          </button>
        )}
      </Board>
      <Alert active={game.status !== ''}>{game.status}</Alert>
    </div>
  );
}

export default NumPuz;
