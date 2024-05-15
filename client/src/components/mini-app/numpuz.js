import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";
import { Counter } from "../inc/inc-classes";
import { Square } from "../inc/shapes";
import "../../styles/mini-app/Numpuz.scss";
import { ChatGPT, Button } from "../inc/inc";
import AppNav from "../inc/app-nav";

class NumPuz extends Component {

  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      grid: false,
      active: false,
      status: '',
      empty: {},
      size: 4
    }
    this.update = this.update.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.activate = this.activate.bind(this);
    this.getTime = this.getTime.bind(this);
  }

  async componentDidMount() {
    await this.generateGrid();
    this.update(this.state.empty);
  }

  shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  getEmpty(grid) {
    let result = [];
    for (let row in grid) {
      for (let cell in grid[row]) {
        if (grid[row][cell].value === '') {
          result.push(grid[row][cell]);
          return result;
        }
      }
    }
  }

  generateGrid() {
    const grid = [];
    const items = [];
    let count = 1;
    const size = this.state.size;
    for (let i = 0; i < size; i++) {
      for (let o = 0; o < size; o++) {
        items.push(count);
        count++;
      }
    }
    items[items.length - 1] = '';
    let randomItems = this.shuffle(items);
    for (let x = 0; x < size; x++) {
      const inner = []
      for (let y = 0; y < size; y++) {
        inner.push({
          draggable: true,
          droppable: false,
          value: randomItems.shift(),
          empty: false,
          x: x,
          y: y
        });
      }
      grid.push(inner);
    }
    let empty = this.getEmpty(grid);
    this.setState({ 
      grid: grid,
      empty: {
        x: empty[0].x,
        y: empty[0].y
      }
     })
  }

  activate() {
    this.setState({ active: true })
  }

  updateStatus(status) {
    this.setState({ status: status })
  }

  getTime(time) {
    this.setState({
      status: `${this.state.status} 
        Your time is ${time.hour} : ${time.minute} : ${time.second} : ${time.tos}`
    });
  }
  update(newObj) {
    
    let grid = this.state.grid;
    let empty = this.state.empty;

    // REST DRAGGABLE CELLS
    for (let row in grid) {
      for (let cell in grid[row]) {
        grid[row][cell].draggable = false;
      }
    }

    // OLD EMPTY
    grid[empty.x][empty.y].empty = false;
    grid[empty.x][empty.y].droppable = false;
    grid[empty.x][empty.y].value = grid[newObj.x][newObj.y].value;

    // NEW EMPTY
    grid[newObj.x][newObj.y].empty = true;
    grid[newObj.x][newObj.y].droppable = true;
    grid[newObj.x][newObj.y].draggable = false;
    grid[newObj.x][newObj.y].value = "";

    // Make nearby items draggable
    if (grid[newObj.x][newObj.y - 1]) grid[newObj.x][newObj.y - 1].draggable = true;
    if (grid[newObj.x][newObj.y + 1]) grid[newObj.x][newObj.y + 1].draggable = true;
    if (grid[newObj.x - 1]) {
      if (grid[newObj.x - 1][newObj.y]) grid[newObj.x - 1][newObj.y].draggable = true;
    }
    if (grid[newObj.x + 1]) {
      if (grid[newObj.x + 1][newObj.y]) grid[newObj.x + 1][newObj.y].draggable = true;
    }

    this.setState({ 
      grid: grid,
    }, () => {
      this.setState({
        empty: {
          x: newObj.x,
          y: newObj.y
        }
      }, () => {
        let win = [1, 2, 3, 4, 5, 6, 7, 8, '']
        let count = 0;
        let correct = 0;
        for (let row in grid) {
          for (let cell in grid[row]) {
            if (grid[row][cell].value === win[count]) {
              correct++;
            }
            count++;
          }
        }
        if (correct === win.length) {
          this.updateStatus(`You won, Congratulations.`);
          this.setState({ active: false })
        } else {
          this.updateStatus(`${Math.round((correct / win.length) * 100)}% Completed`);
        }
      })
    });
  }
  startOver() {

  }
  
  render() {
    if (!this.state.grid) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const sec = {
      background: a.mode,
    }
    const btn = {
      backgroundColor: a.rev,
      color: a.mode
    }
    const rowHeight = {
      height: `calc((100% / ${this.state.grid.length}) - 4px)`
    }
    return(
      <section className="container-fluid numpuz">
        <div className={`container${a.glass ? ' glass' : ''}`} style={sec}>
          <div className="row">
            <div className="body col-6">
              <div className="controller flex-row">
                <Counter getTime={this.getTime} active={this.state.active} data={a} />
                <Button 
                  className="btn" 
                  styles={btn}  
                  onClick={() => this.startOver()} 
                  text="Start Over" />
              </div>
              <Square className="flex-row">
                {this.state.grid.map((row, index) => 
                  <div className="row" style={rowHeight} key={index}> 
                    {row.map((cell, index) => 
                      <Digit 
                        cell={cell} 
                        key={`numpuz-cell${index}`} 
                        activate={this.activate}
                        active={this.state.active}
                        data={a} 
                        update={this.update}
                        updateStatus={this.updateStatus}
                        col={row.length}
                      />
                    )}
                  </div>
                )}
              </Square>
              <div className="statusMsg">{this.state.status}</div>
            </div>
            <div className="col-6" style={{fontSize: '0.9rem'}}>
              <h2>NumPuz Puzzle</h2>
              <p>Numpuz is a type of number riddle puzzle that typically involves arranging a set of numbers or symbols in a particular pattern or sequence. Here are some general rules for playing a Numpuz puzzle:</p>
              <ul>
                <li>Objective: The goal of Numpuz is to fill in the missing numbers or symbols in a sequence or pattern, using logical and mathematical reasoning.</li>
                <li>Setup: A Numpuz puzzle typically consists of a grid of squares or cells, with some squares already filled in with numbers or symbols. The player's task is to fill in the remaining squares to complete the pattern or sequence.</li>
                <li>Gameplay: Each Numpuz puzzle has its own unique rules and patterns, but generally, players use logic and deduction to determine the missing numbers or symbols. Some common techniques include looking for patterns or relationships between adjacent numbers, using basic mathematical operations to derive missing values, and applying deductive reasoning to narrow down the possible values for each square.</li>
                <li>Scoring: Numpuz puzzles are typically not scored, as they are a form of puzzle rather than a competitive game.</li>
                <li>Winning and Losing: There is no "winning" or "losing" in Numpuz, as it is a puzzle that can be solved or completed by finding the correct values for all squares.</li>
              </ul>
              <p>Overall, the rules of Numpuz are relatively simple, but the puzzles themselves can be challenging and require careful observation and logical thinking to solve.</p>
              <ChatGPT color={a.rev}>Generated by ChatGPT</ChatGPT>
            </div>
          </div>
          <AppNav key={0} />
        </div>
      </section>
    )
  }
}

class Digit extends Component {

  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      cell: this.props.cell
    }
  }

  onDragStart(event, cell) {
    if (!this.props.active) this.props.activate();
    event.dataTransfer.setData("cell", JSON.stringify(cell));
  }
  onDragOver(event) {
    event.preventDefault();
  }
  onDrop(event) {
    let cell = JSON.parse(event.dataTransfer.getData("cell"));
    if (!cell.draggable) {
      this.props.updateStatus('Invalid Move');
      return false;
    }
    this.props.update({ 
      x: parseInt(cell.x), 
      y: parseInt(cell.y) 
    });
  }

  render() {
    const a = this.props.data;
    const cell = this.state.cell;
    let bg = cell.empty ? a.mode : a.hex.secondary;
    if (cell.draggable) bg = a.rev;
    const styles = {
      backgroundColor: bg,
      color: a.mode,
      width: `calc((100% / ${this.props.col}) - 4px)`
    }
    return(
      <div 
        className="flex-center cell" 
        style={styles} 
        draggable={cell.draggable} 
        onDrop={(event) => this.onDrop(event)}
        onDragStart={(event) => this.onDragStart(event, cell)}
        onDragOver={(event) => this.onDragOver(event)}
      >
        <h2>{cell.value}</h2>
      </div>
    )
  }

}

export default NumPuz;