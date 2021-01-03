import React, { Component } from "react";
import ".././styles/Minesweeper.scss";
import { Button, RevColor } from "./inc";

class MineSweeper extends Component {

    onClick() {
        console.log('clicked');
    }
    onRightClick() {

    }

    render() {
        const styles = {}
        const body = {}
        if (this.props.data) {
            const a = this.props.data;
            styles.opacity = '1';
            styles.backgroundColor = a.mode;
            styles.color = RevColor(a.mode);
        }
        return (
            <div className="board" style={body}>
                <div className="status flex-row">
                    <Tracker data={this.props.data} />
                    <Counter data={this.props.data} />
                </div>
                <div className="body">
                    {[...Array(100)].map((x,i) => <Block x={x} data={this.props.data} key={i} count={i} />)}
                </div>
                <div className="controller flex-center">
                    <Button className="btn" styles={styles} onClick={() => this.onClick()} text="Start Over" />
                    <Button className="btn" styles={styles} onClick={() => this.onClick()} text="Help" />
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
            <div style={styles} className="counter">{this.state.count}</div>
        )        
    }
}

class Tracker extends Component {
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
            <div style={styles} className="counter">{this.state.count}</div>
        )        
    }
}

class Block extends Component {

    render() {
        const styles = {}
        if (this.props.data) {
            const a = this.props.data;
            styles.backgroundColor = a.mode;
            styles.color = RevColor(a.mode);
            // styles.backgroundImage = `linear-gradient(to right, ${a.primary}, ${a.secondary})`;
        } 
        
        return  (<div className="flex-center digit" style={styles} active={'true'}>{this.props.count + 1}</div>)       
    }
}


export default MineSweeper;