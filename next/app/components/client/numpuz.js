'use client';
import React, { useState, useEffect } from "react";
import { Counter } from "./component";
import { cx, Button, Alert, Board, Loading } from "@/components/server/component";
import { Grid } from "@/components/grid_helper";

/*
 * Number puzzle (15-puzzle): slide tiles into the gap until they read 1, 2, 3… row by row, gap last. Click a
 * tile beside the gap, or drag it onto the gap (touch screens can't drag, so clicking always works). The board
 * is a grid_helper Grid whose cells stay put while their values move; a move stores a shallow copy of the game
 * so React re-renders.
 */

const SIZE = 4;

// The value cell i holds when solved: 1, 2, 3… and the gap (null) last.
const solvedValue = (grid, i) => (i === grid.size - 1 ? null : i + 1);

// Percent of cells in their solved place.
const progress = (grid) => Math.round(grid.cells.filter((cell, i) => cell.value === solvedValue(grid, i)).length / grid.size * 100);

// A solved board shuffled by sliding the gap around at random (never straight back). Shuffling the numbers
// themselves gives an unsolvable board half the time; legal moves from the solved board can always be undone.
const newGame = () => {
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
  return { grid, gap, active: false, won: false, status: '' };
}

const NumPuz = () => {
  // Shuffled in the browser: a random board rendered on the server wouldn't match the browser's (hydration).
  const [ game, setGame ] = useState(null);
  useEffect(() => setGame(newGame()), []);
  if (!game) return <Loading require={[]} />;
  const { grid, gap } = game;
  const besideGap = (cell) => Math.abs(cell.row - gap.row) + Math.abs(cell.col - gap.col) === 1;

  const move = (tile) => {
    if (game.won || tile.value === null) return;
    if (!besideGap(tile)) return setGame({ ...game, status: 'Invalid Move' });
    gap.value = tile.value;
    tile.value = null;
    const done = progress(grid);
    setGame({
      ...game, gap: tile, active: done < 100, won: done === 100,
      status: done === 100 ? 'You won, Congratulations.' : `${done}% Completed`
    });
  }

  // The Counter reports the time when it stops; only a solved puzzle shows it.
  const showTime = (time) => setGame((current) => current.won
    ? { ...current, status: `${current.status} Your time is ${time.hour} : ${time.minute} : ${time.second} : ${time.tos}` }
    : current);

  return (
    <div className="numpuz grid cols-1 gap-sm">
      <div className="grid fixed cols-2 items-center gap-sm pad border round">
        <Counter getTime={showTime} active={game.active} />
        <Button onClick={() => setGame(newGame())}>Start Over</Button>
      </div>
      <Board grid={grid} gap="4px">
        {(cell, i) => (
          <button type="button" key={i} className={cx('center round', cell.value !== null && 'bg-primary')}
            draggable={!game.won && besideGap(cell)}
            onClick={() => move(cell)}
            onDragStart={(e) => e.dataTransfer.setData('text/plain', String(i))}
            onDragOver={(e) => cell === gap && e.preventDefault()} // only the gap accepts a drop
            onDrop={(e) => { e.preventDefault(); move(grid.cells[Number(e.dataTransfer.getData('text/plain'))]); }}>
            <span className="h2">{cell.value}</span>
          </button>
        )}
      </Board>
      <Alert active={game.status !== ''}>{game.status}</Alert>
    </div>
  );
}

export default NumPuz;
