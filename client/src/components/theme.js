import React, { Component } from "react";
// import styled, { css } from 'styled-components';
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
        let head  = document.getElementsByTagName('head')[0];
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        let a = active.primary_color;
        link.innerHTML = `<style>
            body {
                background-color: ${a};
                color: ${a};
            }
            @keyframes glow {
                from {
                  box-shadow: inset 0 0 60px #fff, inset 0 0 90px #fff, 0 0 10px #fff, 0 0 30px #fff, 0 0 50px ${a}, 0 0 60px ${a};                 
                }
                to {
                  box-shadow: inset 0 0 90px #fff, inset 0 0 120px #fff, 0 0 20px #fff, 0 0 40px #fff, 0 0 60px ${a}, 0 0 70px ${a};
                }
              }
        </style>`
        
        head.appendChild(link);
    }
    
    // const active = theme.filter(single => single.active > 0)[0];

    // const bgstyle = styled.button`
    //     background-color: red;
    //     border-radius: 3px;
    //     border: 2px solid palevioletred;
    //     color: palevioletred;
    //     margin: 0 1em;
    //     padding: 0.25em 1em;
    // `
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

        let classes = `single${this.state.active === 1 ? ' active' : ''}`;
        
        return (
            <button key={this.state.id} className={classes}>
                <i className="fas fa-fan small" style={{color: this.state.primary_color}}></i>
                <i className="fas fa-globe median" style={{color: this.state.primary_color}}></i>
                <i className="fab fa-hornbill large" style={{color: this.state.primary_color}}></i>
            </button>
        )
    }
}
export default Theme;