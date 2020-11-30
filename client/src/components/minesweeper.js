import React, { Component } from "react";
import '.././styles/Minesweeper.scss';

class MineSweeper extends Component {

    render() {
        const styles = {}
        const body = {}
        if (this.props.data) {
            const a = this.props.data;
            styles.opacity = '1';
            styles.backgroundColor = a.mode;
            styles.color = a.mode === '#FFF' ? '#383d44' : '#FFF';
        } 
        return  (
            <div className="board" style={body}>
                <div className="status flex-row">
                    <div>0</div>
                    <Counter />
                </div>
                <div className="body">
                    {[...Array(100)].map((x,i) => <Block x={x} data={this.props.data} count={i} />)}
                </div>
                <div className="controller flex-center">
                    <button style={styles}>Restart</button>
                    <button style={styles}>Cancel</button>
                    <button style={styles}>Help</button>
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
        return  (
            <div className="counter">{this.state.count}</div>
        )        
    }
}

class Block extends Component {

    render() {
        const styles = {
            width: 'calc((230px + 15vw) / 10.5)',
            height: 'calc((230px + 15vw) / 10.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: '5px',
            margin: '2px 0'
        }
        if (this.props.data) {
            const a = this.props.data;
            styles.backgroundColor = a.mode;
            // styles.backgroundImage = `linear-gradient(to right, ${a.primary}, ${a.secondary})`;
        } 
        
        return  (<div className="flex-center digit" style={styles} active={'true'}>{this.props.count + 1}</div>)       
    }
}


export default MineSweeper;