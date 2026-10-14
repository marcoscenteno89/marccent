'use client';
import React, { Component, Fragment } from "react";
import { Counter } from "./component";
import { cx, Button, Alert } from "@/components/server/component";
import { withT } from "./hoc";

class NumPuz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: null,
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
    const grid = this.state.grid;
    return(
      <div className="numpuz grid cols-1 gap-2">
        <div className="grid fixed cols-2 items-center gap-2 pad border round">
          <div>
            <Counter getTime={this.getTime} active={this.state.active} />
          </div>
          <div>
            <Button onClick={() => this.startOver()}>
              Start Over
            </Button>
          </div>
        </div>
        {/* One grid for the whole board; square cells (aspect-ratio) make a square board, no JS sizing. */}
        <div className="grid fixed" style={{'--cols': grid[0].length, '--gap': '4px'}}>
          {grid.flat().map((cell, index) => 
            <Digit 
              require={{grid: grid}}
              cell={cell} 
              key={`numpuz-cell${index}`}
              activate={this.activate}
              active={this.state.active}
              update={this.update}
              updateStatus={this.updateStatus}
              col={grid[0].length} />
          )}
        </div>
        <Alert>{this.state.status}</Alert>
      </div>
    )
  }
}

class Digit extends Component {
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
    const cell = this.state.cell;
    return(
      <div 
        className={cx(this.props.className, 'center round', cell.value !== '' && 'bg-primary')}
        style={{aspectRatio: '1 / 1'}}
        draggable={cell.draggable} 
        onDrop={(event) => this.onDrop(event)}
        onDragStart={(event) => this.onDragStart(event, cell)}
        onDragOver={(event) => this.onDragOver(event)}>
        <h2>{cell.value}</h2>
      </div>
    )
  }
}

const NumPuzWT = withT(NumPuz);

export default NumPuzWT;