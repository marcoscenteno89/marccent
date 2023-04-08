import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";
import { PopUp, Counter } from "../inc/inc-classes";
import Select from 'react-select'
import "../../styles/mini-app/Minesweeper.scss";
import { Button, Bomb, RandomNum, Flag } from "../inc/inc";

class MineSweeper extends Component {

  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      row: 10,
      col: 10,
      grid: false,
      mines: false,
      mineCount: 0,
      dificulty: 4,
      popup: false,
      gameOver: false,
      active: false,
      win: false,
      time: 0, 
      revealedCount: 0,
      help: false
    }
    this.getTime = this.getTime.bind(this);
    this.startOver = this.startOver.bind(this);
    this.lost = this.lost.bind(this);
  }
  componentDidMount() {
    this.startOver();
  }
  
  onClick = (e, cell) => {
    console.log(this.state);
    if (this.state.gameOver || cell.revealed) return;
    if (!this.state.active) {
      this.setState({ active: true, popup: false });
    }
    let newGrid = this.state.grid;
    if (cell.mine) { // Do this if user hits mine 
      this.lost();
    } else {
      let grid = this.reveal(newGrid, cell.x, cell.y, 0);
      let count = this.state.revealedCount + grid.newNonMinesCount;
      if (count === 0) { // User won game
        this.setState({
          gameOver: true,
          active: false,
          win: true
        });
      } else { // Game continues
        this.setState({
          grid: grid.arr,
          revealedCount: count,
        });
      }
    }
  }

  onContextMenu = (e, cell) => {
    e.preventDefault();
    if (!this.state.active) {
      this.setState({ active: true });
    }
    let mineCnt = this.state.mineCount;
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
      mineCount: mineCnt
    });
  }

  async startOver() {
    this.setState({
      popup: false,
      help: false,
      grid: await this.createGrid(),
      mineCount: this.state.dificulty * 5,
      revealedCount: 100 - this.state.mineCount
    }, async () => {
      this.setState({ mines: await this.generateMines(this.state.mineCount) }, () => this.generateHints());
    });
  }

  lost() {
    for(let i of this.state.mines) {
      this.state.grid[i.x][i.y].revealed = true; // Reveals all mines
    }
    this.setState({
      popup: true,
      grid: this.state.grid,
      active: false
    });
  }
  createGrid() {
    const grid = []
    let mineCount = 0
    for (let x = 0; x < this.state.row; x++) {
      const inner = []
      for (let y = 0; y < this.state.col; y++) {
        inner.push({
          mine: false,
          revealed: false,
          flagged: false,
          value: 0,
          x: x,
          y: y,
          id: mineCount
        });
        mineCount++;
      }
      grid.push(inner);
      
    }
    return grid;
  }

  generateMines(bombs) {
    const mines = []
    const grid = this.state.grid;
    let count = 0;
    while (count < bombs) {
      let x = RandomNum(0, this.state.row - 1);
      let y = RandomNum(0, this.state.col - 1);
      if (!grid[x][y]['mine']) {
        grid[x][y]['mine'] = true;
        grid[x][y]['value'] = <Bomb />;
        let loc = {x: x, y: y};
        mines.push(loc);
        count++;
      }
    }
    return mines;
  }

  generateHints() { // Check every cell and add number of mines of nerby cells
    const col = this.state.row;
    const row = this.state.row;
    const grid = this.state.grid;
    const callback = (current, data=false) => current.mine ? data.cell.value++ : false;
    for (let x = 0; x < row; x++) {
      for (let y = 0; y < col; y++) {
        if (grid[x][y].mine) continue;
        this.checkNearBy(x,y, {callback: callback, cell: grid[x][y], sendBack: {} });
        this.setState({ grid: grid });
      }
    }
  }

  cellExists(x, y) {
    const grid = this.state.grid
    return x > -1 && x < grid.length && y > -1 && y < grid[0].length ? true : false;
  }

  checkNearBy(x, y, data) { // Check every cell around current one
    let grid = this.state.grid;
    let arr = [-1, 0, 1] // Create a 9 cell Matrix
    for (let i of arr) {
      for (let o of arr) {
        let tl = this.cellExists( x + i, y + o ); // Check if current cell exists
        if (tl) data.callback(grid[x + i][y + o], data);
      }
    }
    return data.sendBack;
  }

  reveal(arr, x, y, newNonMinesCount) {
    if (arr[x][y].revealed) return;
    const flipCallback = (cur, data) => {
      if (cur.value === 0 && !cur.revealed) data.sendBack.push(cur);
    }

    const revealCallback = (cur, data) => {
      if (!cur.revealed) {
        cur.revealed = true;
        data.sendBack--;
      }
      return data.sendBack;
    }

    let flipped = []
    flipped.push(arr[x][y]);
    while (flipped.length !== 0) {
      let s = flipped.pop();
      if (!s.revealed) {
        newNonMinesCount--;
        s.revealed = true;
      }
      if (s.value !== 0) break;
      // Check surrounding cells to check for empty cells and them to flipped array
      flipped = this.checkNearBy(s.x,s.y, {callback: flipCallback, sendBack: flipped});
      // Reveal surronding cells and add them to count down, user wins when count down hits 0
      newNonMinesCount = this.checkNearBy(s.x,s.y, {callback: revealCallback, sendBack: newNonMinesCount});
    }
    return {arr, newNonMinesCount};
  }

  help() {
    this.setState({ help: true });
  }

  getTime(time) {
    this.setState({
      time: `${time.hour} : ${time.minute} : ${time.second} : ${time.tos}`,
      popup: true
    });
  }

  dificulty = async (val) => {
    console.log(val)
    this.setState({dificulty: val.value, mineCount: val.value * 5}, () => this.startOver());
  }

  render() {
    if (!this.state.grid) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const b = this.state;
    const container = {
      paddingTop: '2rem',
      backgroundColor: a.mode,
      color: a.rev,
      alignItems: 'center'
    }
    const select = {
      control: styles => ({ ...styles, backgroundColor: a.mode}),
      input: styles => ({ ...styles, color: a.rev}),
      placeholder: styles => ({ ...styles, color: a.rev}),
      singleValue: (styles, { data }) => ({ ...styles, color: a.rev }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {...styles, 
          color: a.rev,
          backgroundColor: a.mode
        }
      }
    }
    const op = [
      {label: 'Extra Easy', value: 1 },
      {label: 'Very Easy', value: 2 },
      {label: 'Easy', value: 3 },
      {label: 'Normal', value: 4 },
      {label: 'Hard', value: 5 },
      {label: 'Very Hard', value: 6 },
      {label: 'Extra Hard', value: 7 }
    ]
    const btn = {
      marginTop: '0.7rem',
      backgroundColor: a.rev,
      color: a.mode
    }
    const background = `container flex-col${a.glass ? ' glass' : ''}`;

    const header = b.win ? 'Winner' : 'Game Over';

    return (
      <section className="container-fluid minesweeper">
        <div className={background} style={container}>
          <h2>Mine Sweeper</h2>
          <div className="board">
            <div className="status flex-row">
              <Select options={op} styles={select} defaultValue={op[3]} className="select-field" onChange={(val) => this.dificulty(val)} />
              <div data={a}><Flag /> {b.mineCount}</div>
              <div style={{ color: a.rev}} className="counter">
                <Counter getTime={this.getTime} active={b.active} data={a} />
              </div>
            </div>
            <div className="body flex-col-center">
              {b.grid.map((row, index) => 
                <div className="row" key={index}> 
                  {row.map((cell) => 
                    <Cell cell={cell} key={cell.id} data={a} onClick={this.onClick} onContextMenu={this.onContextMenu} />
                  )}
                </div>
              )}
            </div>
            <div className="controller flex-center">
              <Button 
                className="btn" 
                styles={btn} 
                onClick={() => this.startOver()} 
                text="Start Over" 
              />
              <Button 
                className="btn" 
                styles={btn} 
                onClick={() => this.help()} 
                text="Help" 
              />
            </div>
            <PopUp key={1} header={header} controller={this.startOver} display={b.popup} btnText="Start Over">
              <div>{b.win ? `Time: ${b.time}` : 'You Lost'}</div>
            </PopUp>
            <PopUp key={2} header="Mine Sweeper Instructions" display={b.help}>
              <div className="help">
                <h4>About the Game</h4> 
                <p>The object of Minesweeper is to expose all the open areas on the board without hitting an bombs.</p>
                <h4>Instructions</h4>
                <p>Click "Play" to begin the game.</p> 
                <p>Use the left click button on the mouse to select a space on the grid. If you hit a bomb, you lose.</p>
                <p>The numbers on the board represent how many bombs are adjacent to a square. For example, if a square has a "3" on it, then there are 3 bombs next to that square. The bombs could be above, below, right left, or diagonal to the square.</p>
                <p>Avoid all the bombs and expose all the empty spaces to win Minesweeper.</p>
                <p>Tip: Use the numbers to determine where you know a bomb is.</p> 
                <p>Tip: You can right click a square with the mouse to place a flag where you think a bomb is. This allows you to avoid that spot.</p>
              </div>
            </PopUp>
          </div>
        </div>
      </section>
    )        
  }
}

class Cell extends Component {

  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      cell: this.props.cell
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      data: props.data,
      cell: props.cell
    });
  }

  bgStart(a, e) {
    e.target.style.background = a.grad;
  }

  bgLeave(a, e) {
    e.target.style.background = a.mode;
  }

  render() {
    if (!this.props.data) return (<h1>Error</h1>);
    const a = this.props.data;
    const styles = {
      backgroundImage: `radial-gradient(${a.hex.secondary} 15%, ${a.hex.primary} 60%)`,
      color: a.rev
    }

    let value = '';
    if (this.state.cell.flagged) {
      value = <Flag />
    } else if (this.state.cell.revealed) {
      styles.opacity = '0.7';
      if (this.state.cell.value !== 0) value  = this.state.cell.value;
    } else {}
    return  (
      <div className="flex-center digit" style={styles} 
        onClick={(e) => this.props.onClick(e, this.state.cell)}
        onContextMenu={(e) => this.props.onContextMenu(e, this.state.cell)}
        key={this.props.num}> 
          {value} 
      </div>
    )       
  }
}

export default MineSweeper;