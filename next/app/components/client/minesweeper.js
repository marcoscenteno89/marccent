'use client'
import React, { Component, Fragment } from "react";
// import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { SquareWC, Counter } from "./component";
import { Bomb, Flag } from "@/components/sac";
import { WebAlert } from "./component";
import { random } from 'lodash';

class MineSweeper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 15, // ROW SIZE
      grid: false,
      mines: false,
      mineCnt: 0,
      dificulty: 3,
      gameOver: false,
      active: false,
      time: 0, 
      revealedCnt: 0,
      status: ''
    }
    this.getTime = this.getTime.bind(this);
    this.startOver = this.startOver.bind(this);
    this.lost = this.lost.bind(this);
  }
  async componentDidMount() {
    await this.startOver();
  }
  
  onClick = (e, cell) => {
    if (this.state.gameOver || cell.revealed) return;
    if (!this.state.active) this.setState({ active: true });
    let newGrid = this.state.grid;
    if (cell.mine) { // Do this if user hits mine 
      this.lost();
    } else {
      let gridData = this.reveal(newGrid, cell.x, cell.y, 0);
      let count = this.state.revealedCnt - gridData.newNonMinesCnt;
      if (count === 0) { // User won game
        this.win();
      } else { // Game continues
        this.setState({
          grid: gridData.grid,
          revealedCnt: count,
        });
      }
    }
  }

  onContextMenu = (e, cell) => {
    e.preventDefault();
    if (!this.state.active) this.setState({ active: true });
    let mineCnt = this.state.mineCnt;
    let grid = this.state.grid;
    if (grid[cell.x][cell.y].flagged) {
      grid[cell.x][cell.y].flagged = false;
      mineCnt = mineCnt + 1;
    } else {
      if (mineCnt === 0) {
        alert('No more flags available.');
        return;
      }
      grid[cell.x][cell.y].flagged = true;
      mineCnt = mineCnt - 1;
    }
    this.setState({
      grid: grid,
      mineCnt: mineCnt
    });
  }

  async startOver() {
    let i = this.state;
    this.setState({
      gameOver: false,
      active: false,
      mineCnt: i.size * i.dificulty,
      revealedCnt: (i.size * i.size) - (i.size * i.dificulty),
      status: '',
      time: 0,
      grid: false
    }, async () => await this.createGrid());
  }

  lost() {
    const grid = this.state.grid;
    for(let i of this.state.mines) {
      grid[i.x][i.y].revealed = true; // Reveals all mines
    }
    this.setState({
      grid: grid,
      gameOver: true,
      active: false,
      status: 'You Lost!'
    });
  }

  win() {
    this.setState({
      gameOver: true,
      active: false,
      status: 'You won, Congratulations.'
    });
  }

  async createGrid() {
    const grid = []
    let digitId = 1;
    for (let x = 0; x < this.state.size; x++) {
      const inner = []
      for (let y = 0; y < this.state.size; y++) {
        inner.push({
          mine: false,
          revealed: false,
          flagged: false,
          value: 0,
          x: x,
          y: y,
          id: digitId++
        });
      }
      grid.push(inner);
    }
    let data = await this.generateMines(grid);
    let completedGrid = await this.generateHints(data.grid);
    this.setState({
      grid: completedGrid,
      mines: data.mines
    });
  }

  generateMines(grid) {
    const mines = []
    let count = 0;
    while (count < this.state.mineCnt) {
      let x = random(0, this.state.size - 1);
      let y = random(0, this.state.size - 1);
      if (!grid[x][y]['mine']) {
        grid[x][y]['mine'] = true;
        grid[x][y]['value'] = <Bomb />;
        mines.push({
          x: x, 
          y: y
        });
        count++;
      }
    }
    return { grid, mines };
  }

  generateHints(grid) { // Check every cell and add number of mines of nerby cells
    const callback = (current, data=false) => current.mine ? data.cell.value++ : false;
    for (let x = 0; x < this.state.size; x++) {
      for (let y = 0; y < this.state.size; y++) {
        if (grid[x][y].mine) continue;
        this.checkNearBy(x, y, {
          grid: grid,
          callback: callback, 
          cell: grid[x][y], 
          sendBack: {} 
        });
      }
    }
    return grid;
  }

  cellExists(grid, x, y) {
    return x > -1 && x < grid.length && y > -1 && y < grid[0].length ? true : false;
  }

  checkNearBy(x, y, data) { // Check every cell around current one
    let arr = [-1, 0, 1] // Create a 9 cell Matrix
    for (let i of arr) {
      for (let o of arr) {
        let tl = this.cellExists(data.grid, x + i, y + o ); // Check if current cell exists
        if (tl) data.callback(data.grid[x + i][y + o], data);
      }
    }
    return data.sendBack;
  }

  reveal(grid, x, y, newNonMinesCnt) {
    if (grid[x][y].revealed) return;
    const flipCallback = (cur, data) => {
      if (cur.value === 0 && !cur.revealed) data.sendBack.push(cur);
    }

    const revealCallback = (cur, data) => {
      if (!cur.revealed) {
        cur.revealed = true;
        data.sendBack++;
      }
      return data.sendBack;
    }

    let flipped = []
    flipped.push(grid[x][y]);
    while (flipped.length !== 0) {
      let s = flipped.pop();
      if (!s.revealed) {
        newNonMinesCnt++;
        s.revealed = true;
      }
      if (s.value !== 0) break;
      // Check surrounding cells to check for empty cells and them to flipped array
      flipped = this.checkNearBy(s.x,s.y, {
        grid: this.state.grid,
        callback: flipCallback, 
        sendBack: flipped
      });
      // Reveal surronding cells and add them to count down, user wins when count down hits 0
      newNonMinesCnt = this.checkNearBy(s.x,s.y, {
        grid: this.state.grid,
        callback: revealCallback, 
        sendBack: newNonMinesCnt
      });
    }
    return {grid, newNonMinesCnt};
  }

  getTime(time) {
    this.setState({ 
      status: `${this.state.status} 
        Your time is ${time.hour} : ${time.minute} : ${time.second} : ${time.tos}` 
    });
  }

  addRows(num, difficulty, frequency) {
    // Num is the starting point
    // Frequency is the amount of rows added per difficulty level
    for (let i = 0; i < difficulty; i++) num = num + frequency;
    return num;
  }

  dificulty = async (dificulty) => {
    // this.addrows() returns the number of rows per dificulty level
    let size = this.addRows(6, dificulty, 3);
    this.setState({
      size: size,
      dificulty: dificulty,
      mineCnt: size * dificulty,
      active: false
    }, async () => await this.startOver());
  }

  render() {
    if (!this.state.grid) return <Fragment>Loading...</Fragment>
    const b = this.state;
    const active = this.state.status !== '';
    return (
      <div className="minesweeper">
        <div className="align-items-center row p-1 mb-2 border rounded">
          <div className="col-2"><Flag /> {b.mineCnt}</div>
          <div className="col">
            <Counter getTime={this.getTime} active={b.active} />
          </div>
          <div className="col">
            <Form.Select onChange={(val) => this.dificulty(val.target.value)} value={b.dificulty}>
              <option value="1">Very Easy</option>
              <option value="2">Easy</option>
              <option value="3">Normal</option>
              <option value="4">Hard</option>
              <option value="5">Very Hard</option>
            </Form.Select>
          </div>
          <div className="col">
            <Button variant="primary" onClick={async () => await this.startOver()}>
              Start Over
            </Button>
          </div>
        </div>
        <SquareWC>
          {this.state.grid.map((row, index) => 
            <div className="row" style={{height: `calc(100% / ${b.size} - 2px)`}} key={index}>
              {row.map((cell) => 
                <Cell 
                  cell={cell} 
                  size={b.size} 
                  key={`cell-${cell.id}`} 
                  onClick={this.onClick} 
                  onContextMenu={this.onContextMenu} />
              )}
            </div>
          )}
        </SquareWC>
        <WebAlert variant="info" active={active} msg={this.state.status} />
      </div>
    )        
  }
}

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cell: this.props.cell
    }
  }

  bgStart(a, e) {
    e.target.style.background = a.grad;
  }

  bgLeave(a, e) {
    e.target.style.background = a.mode;
  }

  render() {
    const styles = {
      width: `calc(100% / ${this.props.size})`,
    }

    let value = '';
    if (this.state.cell.flagged) value = <Flag />
    if (this.state.cell.revealed) {
      styles.opacity = '0.7';
      if (this.state.cell.value !== 0) value  = this.state.cell.value;
    } 

    return  (
      <div 
        className="col flex-center digit bg-primary rounded" 
        style={styles} 
        onClick={(e) => this.props.onClick(e, this.state.cell)}
        onContextMenu={(e) => this.props.onContextMenu(e, this.state.cell)}
        key={`digit-${this.state.cell.id}`}> 
          {value} 
      </div>
    )       
  }
}

export default MineSweeper;