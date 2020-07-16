import React, { Component } from "react";
const url = "http://localhost:5000/api/theme";

class Theme extends Component {

    constructor(props) {
        super(props);
        this.state = {
            themes: false,
        }
    }

    async componentDidMount() {
        try {
            const res = await fetch(url);
            const jsonData = await res.json();
            this.setState({
                themes: jsonData,
            });
            this.renderCss(this.state.themes);
        } catch (err) {
            console.log(err.message);
        }
    }

    renderCss(themes) {
        let link  = document.createElement('style');
        link.type = 'text/css';
        let text = '';
        themes.map(a => (
            text += `
            nav {}
            .single-${a.name}:hover {
                animation: glow-${a.name} 1s ease-in-out infinite alternate;
            }
            @keyframes glow-${a.name} {
                from {box-shadow: 0 0 10px #fff, 0 0 30px #fff, 0 0 50px ${a.primary_color}, 0 0 60px ${a.primary_color};}
                to { box-shadow: 0 0 20px #fff, 0 0 40px #fff, 0 0 60px ${a.primary_color}, 0 0 70px ${a.primary_color};}
            }`
        ))
        link.innerHTML = `<style>${text}</style>`;
        document.getElementsByTagName('head')[0].appendChild(link);
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
            id: this.props.data.id,
            name: this.props.data.name,
            primary_color: this.props.data.primary_color,
            secundary_color: this.props.data.secundary_color,
            is_dark: this.props.data.is_dark,
            active: this.props.data.active,
            expired: this.props.data.expired,
            expiration_date_time: this.props.data.expiration_date_time
        }
    }

    async componentDidMount() {
        try {
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
            if (this.state.active === 1) this.renderActive(this.state);
        } catch (err) {
            console.log(err.message);
        }
        
    }

    renderActive(active) {
        let link  = document.createElement('style');
        link.type = 'text/css';
        let text  = `
            nav {}
            body {
                background-color: ${active.primary_color} !important;
                color: ${active.primary_color} !important;
            }
            .single-active {
                animation: glow-${active.name} 1s ease-in-out infinite alternate;
            }`
        link.innerHTML = `<style>${text}</style>`;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    update(id) {
        console.log(id);
    }

    render() {
        let classes = `single single-${this.state.name} ${this.state.active === 1 ? 'single-active' : ''}`;

        return (
            <button key={this.state.id} className={classes} onClick={() => this.update(this.state.id)}>
                <i className="fas fa-fan small" style={{color: this.state.primary_color}}></i>
                <i className="fas fa-globe median" style={{color: this.state.primary_color}}></i>
                <i className="fab fa-hornbill large" style={{color: this.state.primary_color}}></i>
            </button>
        )
    }
}
export default Theme;