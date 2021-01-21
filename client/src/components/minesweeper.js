import React, { Component } from "react";
import Select from 'react-select'
import ".././styles/Minesweeper.scss";
import { Button, RevColor, Bomb, RandomNum, Flag } from "./inc";

class MineSweeper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            over: false,
            grid: false,
            mineLocation: false,
            mineCount: 10,
            gameOver: false
        } 
    }
    async componentDidMount() {
        const game = this.createGrid(10, 10, this.state.mineCount);
        this.setState({
            grid: game.grid,
            mineLocation: game.mines,
        });
    }

    onClick = (e, cell) => {
        let newGrid = this.state.grid;
        if (cell.mine) {
            for( let i of this.state.mineLocation) newGrid[i.x][i.y].revealed = true;
            this.setState({
                grid: newGrid
            });
        } else {
            let grid = this.reveal(newGrid, cell.x, cell.y, 0);
            this.setState({
                grid: grid.arr
            });
        }
    }

    onContextMenu = (e, cell) => {
        e.preventDefault();
        let mineCnt = this.state.mineCount;
        let newGrid = this.state.grid;
        if (newGrid[cell.x][cell.y].flagged) {
            newGrid[cell.x][cell.y].flagged = false;
            mineCnt = mineCnt + 1;
        } else {
            if (mineCnt == 0) {
                alert('No more flags available.');
                return;
            }
            newGrid[cell.x][cell.y].flagged = true;
            mineCnt = mineCnt - 1;
        }
        this.setState({
            grid: newGrid,
            mineCount: mineCnt
        })
    }

    createGrid(row, col, bombs) {
        const grid = []
        const mines = []
        let mineCount = 0
        for (let x = 0; x < row; x++) {
            const inner = []
            for (let y = 0; y < col; y++) {
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

        let count = 0;
        while (count < bombs) {
            let x = RandomNum(0, row - 1);
            let y = RandomNum(0, col - 1);
            if (!grid[x][y]['mine']) {
                grid[x][y]['mine'] = true;
                grid[x][y]['value'] = <Bomb />;
                let loc = {x: x, y: y};
                mines.push(loc);
                count++;
            }
        }

        for (let x = 0; x < row; x++) {
            for (let y = 0; y < col; y++) {
                let cell = grid[x][y];
                if (cell.mine) continue;
        
                if (x > 0 && grid[x - 1][y].mine) cell.value++; // TOP
        
                if (x > 0 && y < col - 1 && grid[x - 1][y + 1].mine) cell.value++; // TOP RIGHT
        
                if (y < col - 1 && grid[x][y + 1].mine) cell.value++; // RIGHT
        
                if (x < row - 1 && y < col - 1 && grid[x + 1][y + 1].mine) cell.value++; // BOTTOM RIGHT
        
                if (x < row - 1 && grid[x + 1][y].mine) cell.value++; // BOTTOM
        
                if (x < row - 1 && y > 0 && grid[x + 1][y - 1].mine) cell.value++; // BOTTOM LEFT
        
                if (y > 0 && grid[x][y - 1].mine) cell.value++; // LEFT
        
                if (x > 0 && y > 0 && grid[x - 1][y - 1].mine) cell.value++; // TOP LEFT
            }
          }

        return { grid, mines };
    }


    reveal(arr, x, y, newNonMinesCount) {
        if (arr[x][y].revealed) return;
    
        let flipped = [];
        flipped.push(arr[x][y]);
        while (flipped.length !== 0) {
          let s = flipped.pop();
      
          if (!s.revealed) {
            newNonMinesCount--;
            s.revealed = true;
          }
      
          if (s.value !== 0) break;
          
          if (s.x > 0 && s.y > 0) { // Top - Left
            let tl = arr[s.x - 1][s.y - 1];
            if (tl.value === 0 && !tl.revealed) flipped.push(tl);
          }
          
          if (s.x < arr.length - 1 && s.y < arr[0].length - 1) { // Bottom - Right
            let br = arr[s.x + 1][s.y + 1];
            if (br.value === 0 && !br.revealed) flipped.push(br);
          }
          
          if (s.x < arr.length - 1 && s.y > 0) { // Bottom - Left
            let bl = arr[s.x + 1][s.y - 1]; 
            if (bl.value === 0 && !bl.revealed) flipped.push(bl);
          }
          
          if (s.x > 0 && s.y < arr[0].length - 1) { // Top - Right
            let tr = arr[s.x - 1][s.y + 1]; 
            if (tr.value === 0 && !tr.revealed) flipped.push(tr);
          }
          
          // single ones
          if (s.x > 0) { // Top
            let top = arr[s.x - 1][s.y]; 
            if (top.value === 0 && !top.revealed) flipped.push(top);
          }
          if (s.x < arr.length - 1) { // Bottom
            let bottom = arr[s.x + 1][s.y]; 
            if (bottom.value === 0 && !bottom.revealed) flipped.push(bottom);
          }
          
          if (s.y > 0) { // Left
            let left = arr[s.x][s.y - 1]; 
            if (left.value === 0 && !left.revealed) flipped.push(left);
          }
          
          if (s.y < arr[0].length - 1) { // Right
            let right = arr[s.x][s.y + 1]; 
            if (right.value === 0 && !right.revealed) flipped.push(right);
          }
      
          // Start Revealing Items
          if (s.x > 0 && s.y > 0 && !arr[s.x - 1][s.y - 1].revealed) { //Top Left Reveal
            arr[s.x - 1][s.y - 1].revealed = true;
            newNonMinesCount--;
          }
      
          if (s.y > 0 && !arr[s.x][s.y - 1].revealed) { // Left Reveal
            arr[s.x][s.y - 1].revealed = true;
            newNonMinesCount--;
          }
      
          if (s.x < arr.length - 1 && s.y > 0 && !arr[s.x + 1][s.y - 1].revealed) { //Bottom Left Reveal
            arr[s.x + 1][s.y - 1].revealed = true;
            newNonMinesCount--;
          }
      
          if (s.x > 0 && !arr[s.x - 1][s.y].revealed) { //Top Reveal
            arr[s.x - 1][s.y].revealed = true;
            newNonMinesCount--;
          }
      
          if (s.x < arr.length - 1 && !arr[s.x + 1][s.y].revealed) { // Bottom Reveal
            arr[s.x + 1][s.y].revealed = true;
            newNonMinesCount--;
          }
      
          if (s.x > 0 && s.y < arr[0].length - 1 && !arr[s.x - 1][s.y + 1].revealed) { // Top Right Reveal
            arr[s.x - 1][s.y + 1].revealed = true;
            newNonMinesCount--;
          }
      
          if (s.y < arr[0].length - 1 && !arr[s.x][s.y + 1].revealed) { //Right Reveal
            arr[s.x][s.y + 1].revealed = true;
            newNonMinesCount--;
          }
      
          if (s.x < arr.length - 1 && s.y < arr[0].length - 1 && !arr[s.x + 1][s.y + 1].revealed) {// Bottom Right Reveal
            arr[s.x + 1][s.y + 1].revealed = true;
            newNonMinesCount--;
          }
        }
      
        return { arr, newNonMinesCount };
    }

    dificulty = (val) => {
        console.log(val);
        // this.setState({mineCount: val})
    }

    render() {
        if (!this.props.data || !this.state.grid) return (<h1>There was an error</h1>);
        const a = this.props.data;
        const b = this.state;
        const board = {
            backgroundColor: a.mode,
            color: RevColor(a.mode)
        }
        const select = {
            control: styles => ({ ...styles, backgroundColor: a.mode}),
            input: styles => ({ ...styles, color: RevColor(a.mode)}),
            placeholder: styles => ({ ...styles, color: RevColor(a.mode)}),
            singleValue: (styles, { data }) => ({ ...styles, color: RevColor(a.mode) }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                return {...styles, 
                    color: RevColor(a.mode),
                    backgroundColor: a.mode
                }
            }
        }
        const op = [
            {label: 'Easy', value: 10 },
            {label: 'Medium', value: 15 },
            {label: 'Hard', value: 20 },
            {label: 'Extra Hard', value: 25 },
        ]
        return (
            <div className="board">
                <div className="status flex-row">
                    <Select 
                        options={op}
                        styles={select}
                        defaultValue={op[1]} 
                        className="select-field"
                        onChange={(val) => this.dificulty(val)} 
                    />
                    {/* <select style={board}>
                        <option value="10">Easy</option>
                        <option value="15" selected>Medium</option>
                        <option value="20">Hard</option>
                        <option value="25">Extra Hard</option>
                    </select> */}
                    <div data={a}><Flag /> {b.mineCount}</div>
                    <Counter data={a} />
                </div>
                <div className="body">
                    {b.grid.map((row, index) => 
                        <div className="bd-col" key={index} value={index}> {row.map((cell) => 
                            <Cell
                                cell={cell}
                                key={cell.id}
                                data={a} 
                                over={this.state.over}
                                onClick={this.onClick}
                                onContextMenu={this.onContextMenu}
                            />
                        )}
                        </div>
                    )}
                </div>
                <div className="controller flex-center">
                    <Button className="btn" styles={board} onClick={() => this.onClick()} text="Start Over" />
                    <Button className="btn" styles={board} onClick={() => this.onClick()} text="Help" />
                </div>
            </div>
        )        
    }
}

class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }
    componentDidMount() {
        setInterval(() => this.setState({count: this.state.count + 1}), 1000);
    }
       
    render() {

        const styles = {}
        if (this.props.data) {
            const a = this.props.data;
            styles.color = RevColor(a.mode);
        }

        return  (
            <div style={styles} className="counter">
                <i className="fas fa-stopwatch"></i> {this.state.count}
            </div>
        )        
    }
}

class Cell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            cell: this.props.cell,
            over: this.props.over,
        }
    }

    bgStart(a, e) {
        e.target.style.background = `linear-gradient(to right, ${a.primary}, ${a.secondary})`;
        e.target.style.fontSize = '0.9rem';
        e.target.style.fontWeight = '800';
    }

    bgLeave(a, e) {
        e.target.style.background = a.mode;
        e.target.style.fontSize = '0.7rem';
        e.target.style.fontWeight = '400';
    }

    render() {
        if (!this.props.data) return (<h1>Error</h1>);
        const min = RevColor(this.props.data.mode);
        const styles = {
            backgroundColor: this.props.data.mode,
            color: min
        }
        let value = '';
        if (this.state.cell.flagged) {
            value = <Flag />
        } else if (this.state.cell.revealed) {
            styles.opacity = '0.7';
            if (this.state.cell.value !== 0) value = this.state.cell.value;
        } else {}
        let extra = `${this.state.cell.x}, ${this.state.cell.y}`;
        return  (
            <div className="flex-center digit" style={styles} 
                onMouseLeave={this.bgLeave.bind(this, this.props.data)} 
                onMouseOver={this.bgStart.bind(this, this.props.data)}
                onClick={(e) => this.props.onClick(e, this.state.cell)}
                onContextMenu={(e) => this.props.onContextMenu(e, this.state.cell)}
                key={this.props.num}> 
                    {value} 
                </div>
        )       
    }
}


export default MineSweeper;