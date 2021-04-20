import React, { Component } from "react";
import "../../styles/inc/Incclasses.scss";

class StatusBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0,
            width: 0
        }
    }

    componentDidMount(e) {
        const runInterval = () => {
            this.setState({
                width: this.state.width + 1
            });
        }
        const speed = this.props.bar.speed ? this.props.bar.speed : 100;
        const percent = (this.props.bar.current / this.props.bar.total) * 100;
        let id = setInterval(() => this.state.width >= percent ? clearInterval(id) : runInterval(), speed);
    }

    render() {
        const bar = {...this.props.styles, ...{width: `${this.state.width}%`}};

        return (
            <div className="bar-container">
                <div className="bar" style={{width: '100%'}}>
                    <div className="progress" style={bar}>{`${this.state.width}%`}</div>
                </div>
            </div>
        )
        
    }
}

export { 
    StatusBar
}