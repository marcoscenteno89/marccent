import React, { Component } from "react";
import "../styles/Incclasses.scss";
import { LinGrad } from "./inc";

class StatusBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: this.props.percent,
            width: 0
        }
    }

    componentDidMount(e) {
        const runInterval = () => {
            this.setState({
                width: this.state.width + 1
            });
        }
        const percent = (this.props.bar.current / this.props.bar.total) * 100;
        let id = setInterval(() => this.state.width >= percent ? clearInterval(id) : runInterval(), 100);
    }

    render() {
        const a = this.props.data;
        const o = this.state.width;
        const bar = {
            width: `${o}%`,
            background: LinGrad(a.primary, a.secondary)
        }
        return (
            <div className="bar-container">
                <div className="bar" style={{width: '100%'}}>
                    <div className="progress" style={bar}>{`${o}%`}</div>
                </div>
            </div>
        )
        
    }
}

export { 
    StatusBar
}