import React, { Component } from 'react';
import { RevColor, GetMode, GetRgb, LinGrad } from "./inc/inc";

export const ThemeContext = React.createContext();

export class ThemeProvider extends Component {

    state = {
        id: 0
    }

    getThemes = async () => {
        const url = process.env.REACT_APP_STRAPIURL;
        let themes = JSON.parse(localStorage.getItem('marccent_themes'));
        let active = JSON.parse(localStorage.getItem('marccent_active'));
        
        if (!themes) {
            const res = await fetch(`${url}themes/`);
            themes = await res.json();
            localStorage.setItem('marccent_themes', JSON.stringify(themes));
        }

        if (!active) {
            const darkJson = await fetch(`${url}options?name=theme_dark`);
            const lightJson = await fetch(`${url}options?name=theme_light`);
            let dark = await darkJson.json();
            let light = await lightJson.json();
            active = {
                id: themes[0].id,
                rgb: {
                    dark: GetRgb(dark[0].value),
                    light: GetRgb(light[0].value),
                    primary: GetRgb(themes[0].primary),
                    secondary: GetRgb(themes[0].secondary)
                },
                hex: {
                    dark: dark[0].value,
                    light: light[0].value,
                    primary: themes[0].primary,
                    secondary: themes[0].secondary
                },
                grad: LinGrad(themes[0].primary, themes[0].secondary),
                is_dark: true,
                glass: false,
            }
            active.mode = GetMode(active, 1);
            active.rev = RevColor(active, 1);
        }
        this.setState(active, () => this.storeTheme(this.state));
    }

    addTheme = theme => {
        let themes = JSON.parse(localStorage.getItem('marccent_themes'));
        let largest = themes[0].id;
        for (let i of themes) {
            if (i.id > largest) largest = i.id
        }
        delete theme.showForm;
        theme.id = largest + 1;
        themes.push(theme);
        localStorage.setItem('marccent_themes', JSON.stringify(themes));
        this.updateTheme(theme.id);
    }

    updateTheme = (id) => {
        let themes = JSON.parse(localStorage.getItem('marccent_themes'));
        let theme = themes.filter(i => i.id === id);
        let temp = this.state;
        let active = {
            id: theme[0].id,
            rgb: {
                dark: temp.rgb.dark,
                light: temp.rgb.light,
                primary: GetRgb(theme[0].primary),
                secondary: GetRgb(theme[0].secondary)
            },
            hex: {
                dark: temp.hex.dark,
                light: temp.hex.light,
                primary: theme[0].primary,
                secondary: theme[0].secondary
            },
            grad: LinGrad(theme[0].primary, theme[0].secondary)
        }
        active.mode = GetMode(active, 1);
        active.rev = RevColor(active, 1);
        this.setState(active, () => this.storeTheme(active));
    }

    isGlass = (i) => {
        this.setState({ 
            glass: i,
            mode: GetMode(this.state, this.state.glass ? 0.6 : 1),
            rev: RevColor(this.state, 1)
        }, () => this.storeTheme(this.state));
    }

    isDark = (i) => {
        this.setState({
            is_dark: i,
            mode: GetMode(this.state, this.state.glass ? 0.6 : 1),
            rev: RevColor(this.state, 1)
        }, () => this.storeTheme(this.state));
    }

    storeTheme = (i) => localStorage.setItem('marccent_active', JSON.stringify(i));

    render() {
        return (
            <ThemeContext.Provider value={{
                active: this.state, 
                isDark: this.isDark,
                isGlass: this.isGlass,
                updateTheme: this.updateTheme,
                getThemes: this.getThemes,
                addTheme: this.addTheme,
                themeList: JSON.parse(localStorage.getItem('marccent_themes'))
            }}>
                {this.props.children}
            </ThemeContext.Provider>
        )
    }
}