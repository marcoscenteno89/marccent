import React, { Component } from "react";
import styled, { css, keyframes } from 'styled-components';
const url = "http://localhost:5000/api/theme";

class Theme extends Component {

    constructor(props) {
        super(props);
        this.state = {
            themes: false,
            active: false
        }
    }

    async componentDidMount() {
        try {
            const res = await fetch(url);
            const jsonData = await res.json();
            this.setState({
                themes: jsonData,
                active: jsonData.filter(single => single.active > 0)[0]
            });
            if (this.state.active !== false) this.renderActive(this.state.active);
        } catch (err) {
            console.log(err.message);
        }
        
    }

    renderActive(active) {
        const body = document.body;
        const a = active.primary_color;
        body.style.background = a;
        body.style.color = a;
    }

    render() {

        if (this.state.themes === false) return <footer className="theme">No theme found</footer>
        
        return (
            <footer className="theme">
                <div className="container">
                    {this.state.themes.map(single => (
                        <Choices key={single.id} data={single}></Choices>
                    ))}
                </div>
            </footer>
        )
    }
}

class Choices extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            name: '',
            primary_color: '',
            secundary_color: '',
            is_dark: 0,
            active: 0,
            expired: 0,
            expiration_date_time: null
        }
    }

    componentDidMount() {
        this.setState({
            id: this.props.data.id,
            name: this.props.data.name,
            primary_color: this.props.data.primary_color,
            secundary_color: this.props.data.secundary_color,
            is_dark: this.props.data.is_dark,
            active: this.props.data.active,
            expired: this.props.data.expired,
            expiration_date_time: this.props.data.expiration_date_time
        }); 
    }

    render() {

        // let classes = `single${this.state.active === 1 ? ' active' : ''}`;
        const a = this.state.primary_color;
        // const glow = keyframes`
        //     0% { box-shadow: inset 0 0 60px #fff, inset 0 0 90px #fff, 0 0 10px #fff, 0 0 30px #fff, 0 0 50px ${a}, 0 0 60px ${a} }
        //     100% { box-shadow: inset 0 0 90px #fff, inset 0 0 120px #fff, 0 0 20px #fff, 0 0 40px #fff, 0 0 60px ${a}, 0 0 70px ${a}; }
        // `;
        const styles = css`
            animation: glow 1s ease-in-out infinite alternate;
            @keyframes glow {
                0% { box-shadow: inset 0 0 60px #fff, inset 0 0 90px #fff, 0 0 10px #fff, 0 0 30px #fff, 0 0 50px ${a}, 0 0 60px ${a} }
                100% { box-shadow: inset 0 0 90px #fff, inset 0 0 120px #fff, 0 0 20px #fff, 0 0 40px #fff, 0 0 60px ${a}, 0 0 70px ${a}; }
            }`

        return (
            <button key={this.state.id} className="single">
                <i className="fas fa-fan small" style={{color: a}}></i>
                <i className="fas fa-globe median" style={{color: a}}></i>
                <i className="fab fa-hornbill large" style={{color: a}}></i>
            </button>
        )
    }
}
export default Theme;