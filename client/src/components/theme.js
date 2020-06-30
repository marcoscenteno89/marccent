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
        } catch (err) {
            console.log(err.message);
        }
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
    render() {;
        
        if (this.state.themes === false) return <footer className="theme">No theme found</footer>

        return (
        <footer className="theme">
            <div className="container">
                {this.state.themes.map(single => (
                    <div key={single.id} className="single">
                        <i className="fas fa-fan small" style={{color: single.primary_color}}></i>
                        <i className="fas fa-globe median" style={{color: single.primary_color}}></i>
                        <i className="fab fa-hornbill large" style={{color: single.primary_color}}></i>
                    </div>
                ))}
            </div>
        </footer>
        )
    }
}

export default Theme;