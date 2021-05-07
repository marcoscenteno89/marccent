import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";
import { PopUp } from "../inc/inc-classes";
import Select from 'react-select'
import "../../styles/mini-app/Minesweeper.scss";
import { Button, Bomb, RandomNum, Flag } from "../inc/inc";

class MineSweeper extends Component {

    static contextType = ThemeContext;
    constructor(props) {
        super(props);
        this.state = {
            grid: false,
            mineLocation: false,
            mineCount: 15,
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
    }
    async componentDidMount() {
        const game = this.createGrid(10, 10, this.state.mineCount);
        this.setState({
            grid: game.grid,
            mineLocation: game.mines,
            mineCount: this.state.mineCount,
            revealedCount: 100 - this.state.mineCount
        });
    }

    onClick = (e, cell) => {
        if (this.state.gameOver || cell.revealed) return;
        if (!this.state.active) {
            this.setState({
                active: true
            });
        }
        let newGrid = this.state.grid;
        if (cell.mine) {
            for( let i of this.state.mineLocation) newGrid[i.x][i.y].revealed = true;
            this.setState({
                grid: newGrid,
                gameOver: true
            });
        } else {
            let grid = this.reveal(newGrid, cell.x, cell.y, 0);
            let count = this.state.revealedCount + grid.newNonMinesCount;
            if (count === 0) {
                this.setState({
                    gameOver: true,
                    active: false,
                    win: true
                });
            } else {
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
            this.setState({
                active: true
            });
        }
        let mineCnt = this.state.mineCount;
        let newGrid = this.state.grid;
        if (newGrid[cell.x][cell.y].flagged) {
            newGrid[cell.x][cell.y].flagged = false;
            mineCnt = mineCnt + 1;
        } else {
            if (mineCnt === 0) {
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

    startOver() {
        const game = this.createGrid(10, 10, this.state.mineCount);
        this.setState({
            gameOver: false,
            grid: game.grid,
            mineLocation: game.mines,
            popup: false,
            help: false
        });
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

    help() {
        this.setState({
            help: true
        });
    }

    getTime(time) {
        this.setState({
            active: false,
            gameOver: false,
            time: time,
            popup: true
        }, () => console.log(this.state));
    }

    dificulty = (val) => {
        const game = this.createGrid(10, 10, val.value);
        this.setState({
            mineCount: val.value,
            gameOver: false,
            grid: game.grid,
            mineLocation: game.mines,
        });
    }

    render() {
        if (!this.state.grid) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
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
            {label: 'Easy', value: 10 },
            {label: 'Medium', value: 15 },
            {label: 'Hard', value: 20 },
            {label: 'Extra Hard', value: 25 }
        ]
        const btn = {
            marginTop: '0.7rem',
            backgroundColor: a.rev,
            color: a.mode
        }
        const background = `container flex-col${a.glass ? ' glass' : ''}`;

        const header = b.win ? 'Winner' : 'Game Over';

        return (
            <section className="minesweeper flex-center">
                <div className={background} style={container}>
                    <h2>Mine Sweeper</h2>
                    <div className="board">
                        <div className="status flex-row">
                            <Select 
                                options={op}
                                styles={select}
                                defaultValue={op[1]}
                                className="select-field"
                                onChange={(val) => this.dificulty(val)} 
                            />
                            <div data={a}><Flag /> {b.mineCount}</div>
                            <div style={{ color: a.rev}} className="counter">
                                <Counter getTime={this.getTime} active={b.active} data={a} gameOver={b.gameOver} />
                            </div>
                        </div>
                        <div className="body">
                            {b.grid.map((row, index) => 
                                <div className="bd-col" key={index}> {row.map((cell) => 
                                    <Cell
                                        cell={cell}
                                        key={cell.id}
                                        data={a} 
                                        onClick={this.onClick}
                                        onContextMenu={this.onContextMenu}
                                    />
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

class Counter extends Component {

    static contextType = ThemeContext;
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            active: false,
        }
    }

    componentWillReceiveProps(e) {
        if (e.active && this.state.count === 0) {
                this.setState({
                    active: true
                }, () => {
                        this.timer = setInterval(() => this.setState({count: this.state.count + 1}), 1000);
                });
        }
        if (e.gameOver) {
            let temp = this.state.count;
            clearInterval(this.timer);
            this.setState({
                count: 0,
                active: false
            }, () => e.getTime(temp));
        }
    }

    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        return  (
            <Fragment>
                <i className="fas fa-stopwatch"></i> {this.state.count}
            </Fragment>
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

    componentWillReceiveProps(props) {
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