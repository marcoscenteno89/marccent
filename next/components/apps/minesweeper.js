'use client'
import { cx } from '@/lib/cx';
import React, { useState } from "react";
import { Counter } from '@/components/ui/counter';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Board } from '@/components/ui/board';
import { Grid } from "@/lib/grid_helper";
import { Store, useStore } from "@/lib/store";
import '@/styles/components/form.css';

/*
 * Minesweeper. MinesweeperGame holds the game in plain JS (a grid_helper Grid of cells changed in place); the
 * component only renders it. Mines are placed on the first reveal, away from that cell and its
 * neighbours, so the first click is always safe and opens an area. Flag with a right click, or switch the flag
 * button on (touch screens have no right click).
 */

const LEVELS = [ 'Very Easy', 'Easy', 'Normal', 'Hard', 'Very Hard' ];

/**
 * MinesweeperGame: one game's state and moves, in plain JS. Cells are changed in place and emit() re-renders the
 * component (useStore). Level 1-5: the board grows by 3 cells a side per level, with `size` mines per level.
 */
class MinesweeperGame extends Store {
  constructor(level = 3) {
    super();
    this.restart(level);
  }

  restart(level = this.level) {
    const size = 6 + 3 * level;
    const mines = size * level;
    Object.assign(this, {
      level, size, mines,
      flags: mines, // flags left to place
      safeLeft: size * size - mines, // cells to reveal to win
      mined: false,
      over: false,
      active: false, // timer running
      status: '',
      grid: new Grid(size, size, (row, col, id) => ({ row, col, id, mine: false, revealed: false, flagged: false, hint: 0 }))
    });
    this.emit();
  }

  // Mines everywhere except the first revealed cell and its neighbours, then each cell's count of mines around it.
  placeMines(first) {
    const { grid } = this;
    const safe = new Set([ first, ...grid.neighbors(first.row, first.col) ]);
    for (const cell of grid.sample(this.mines, (cell) => !safe.has(cell))) cell.mine = true;
    grid.forEach((cell, row, col) => {
      cell.hint = grid.neighbors(row, col).filter((near) => near.mine).length;
    });
    this.mined = true;
  }

  end(status) {
    Object.assign(this, { over: true, active: false, status });
    this.emit();
  }

  reveal(cell) {
    if (this.over || cell.revealed || cell.flagged) return;
    if (!this.mined) this.placeMines(cell);
    if (cell.mine) {
      for (const mine of this.grid.filter((c) => c.mine)) mine.revealed = true;
      return this.end('You Lost!');
    }
    // Empty cells (no mines around) open their neighbours; numbered ones stop the spread.
    const opened = this.grid.floodFill(cell.row, cell.col, (c) => c.hint === 0, { enter: (c) => !c.revealed && !c.flagged });
    for (const c of opened) c.revealed = true;
    this.safeLeft -= opened.length;
    if (this.safeLeft === 0) return this.end('You won, Congratulations.');
    this.active = true;
    this.emit();
  }

  flag(cell) {
    if (this.over || cell.revealed) return;
    if (!cell.flagged && this.flags === 0) {
      this.status = 'No more flags available.';
      return this.emit();
    }
    cell.flagged = !cell.flagged;
    this.flags += cell.flagged ? -1 : 1;
    Object.assign(this, { active: true, status: '' });
    this.emit();
  }

  // The Counter reports the time when it stops; only a finished game shows it.
  showTime(time) {
    if (!this.over) return;
    this.status += ` Your time is ${time.hour} : ${time.minute} : ${time.second} : ${time.tos}`;
    this.emit();
  }
}

const MineSweeper = () => {
  const game = useStore(() => new MinesweeperGame(3));
  const [ flagMode, setFlagMode ] = useState(false);

  return (
    <div className="grid cols-1 gap-sm">
      <div className="grid fixed cols-4 items-center gap-sm pad border round">
        <Button icon="flag" aria-pressed={flagMode}
          aria-label={`Flag mode, ${game.flags} flags left`} onClick={() => setFlagMode(!flagMode)}>
          {String(game.flags)}
        </Button>
        <Counter getTime={(time) => game.showTime(time)} active={game.active} />
        <select className="input" aria-label="Difficulty" value={game.level}
          onChange={(e) => game.restart(Number(e.target.value))}>
          {LEVELS.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
        </select>
        <Button onClick={() => game.restart()}>Start Over</Button>
      </div>
      <Board grid={game.grid} className="bg-gradient-run">
        {(cell, i) => (
          // A card per square. Hidden: a window onto one gradient across the board (.bg-gradient-run; colors.css counts
          // only 24 cells, so each gets its place and the total here), raised with a holographic hover. Revealed: flat.
          <button type="button" key={cell.id} className={cx('center round square', cell.revealed ? 'bg border' : 'shadow hover-holographic')}
            style={cell.revealed ? { opacity: 0.6, backgroundImage: 'none' } : { '--run-i': i, '--run-n': game.grid.cells.length }}
            onClick={() => (flagMode ? game.flag(cell) : game.reveal(cell))}
            onContextMenu={(e) => { e.preventDefault(); game.flag(cell); }}>
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
