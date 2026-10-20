'use client'
import React, { useState } from "react";
import { Counter } from "./component";
import { Icon, Button, Alert, Board } from "@/components/server/component";
import { Grid } from "@/components/grid_helper";

/*
 * Minesweeper. The board is a grid_helper Grid of cells that are changed in place; a move then stores a shallow
 * copy of the game so React re-renders. Mines are placed on the first reveal, away from that cell and its
 * neighbours, so the first click is always safe and opens an area. Flag with a right click, or switch the flag
 * button on (touch screens have no right click).
 */

const LEVELS = [ 'Very Easy', 'Easy', 'Normal', 'Hard', 'Very Hard' ];

// A fresh, unmined board. Level 1-5: the board grows by 3 cells a side per level, with `size` mines per level.
const newGame = (level) => {
  const size = 6 + 3 * level;
  const mines = size * level;
  return {
    level, size, mines,
    flags: mines, // flags left to place
    safeLeft: size * size - mines, // cells to reveal to win
    mined: false,
    over: false,
    active: false, // timer running
    status: '',
    grid: new Grid(size, size, (row, col, id) => ({ row, col, id, mine: false, revealed: false, flagged: false, hint: 0 }))
  };
}

// Mines everywhere except the first revealed cell and its neighbours, then each cell's count of mines around it.
const placeMines = (game, first) => {
  const { grid } = game;
  const safe = new Set([ first, ...grid.neighbors(first.row, first.col) ]);
  for (const cell of grid.sample(game.mines, (cell) => !safe.has(cell))) cell.mine = true;
  grid.forEach((cell, row, col) => {
    cell.hint = grid.neighbors(row, col).filter((near) => near.mine).length;
  });
  game.mined = true;
}

const MineSweeper = () => {
  const [ game, setGame ] = useState(() => newGame(3));
  const [ flagMode, setFlagMode ] = useState(false);
  const update = (changes = {}) => setGame({ ...game, ...changes });

  const reveal = (cell) => {
    if (game.over || cell.revealed || cell.flagged) return;
    if (!game.mined) placeMines(game, cell);
    if (cell.mine) {
      for (const mine of game.grid.filter((c) => c.mine)) mine.revealed = true;
      return update({ over: true, active: false, status: 'You Lost!' });
    }
    // Empty cells (no mines around) open their neighbours; numbered ones stop the spread.
    const opened = game.grid.floodFill(cell.row, cell.col, (c) => c.hint === 0, { enter: (c) => !c.revealed && !c.flagged });
    for (const c of opened) c.revealed = true;
    const safeLeft = game.safeLeft - opened.length;
    if (safeLeft === 0) return update({ safeLeft, over: true, active: false, status: 'You won, Congratulations.' });
    update({ safeLeft, active: true });
  }

  const flag = (cell) => {
    if (game.over || cell.revealed) return;
    if (!cell.flagged && game.flags === 0) return update({ status: 'No more flags available.' });
    cell.flagged = !cell.flagged;
    update({ flags: game.flags + (cell.flagged ? -1 : 1), active: true, status: '' });
  }

  // The Counter reports the time when it stops; only a finished game shows it.
  const showTime = (time) => setGame((current) => current.over
    ? { ...current, status: `${current.status} Your time is ${time.hour} : ${time.minute} : ${time.second} : ${time.tos}` }
    : current);

  return (
    <div className="minesweeper grid cols-1 gap-sm">
      <div className="grid fixed cols-4 items-center gap-sm pad border round">
        <Button icon="flag" aria-pressed={flagMode}
          aria-label={`Flag mode, ${game.flags} flags left`} onClick={() => setFlagMode(!flagMode)}>
          {String(game.flags)}
        </Button>
        <Counter getTime={showTime} active={game.active} />
        <select className="input" aria-label="Difficulty" value={game.level}
          onChange={(e) => setGame(newGame(Number(e.target.value)))}>
          {LEVELS.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
        </select>
        <Button onClick={() => setGame(newGame(game.level))}>Start Over</Button>
      </div>
      <Board grid={game.grid} gap="2px">
        {(cell) => (
          <button type="button" key={cell.id} className="center bg-primary round"
            style={{ opacity: cell.revealed ? 0.7 : undefined }}
            onClick={() => (flagMode ? flag(cell) : reveal(cell))}
            onContextMenu={(e) => { e.preventDefault(); flag(cell); }}>
            {cell.revealed
              ? (cell.mine ? <Icon name="bomb" /> : cell.hint || '')
              : (cell.flagged && <Icon name="flag" />)}
          </button>
        )}
      </Board>
      <Alert active={game.status !== ''}>{game.status}</Alert>
    </div>
  );
}

export default MineSweeper;
