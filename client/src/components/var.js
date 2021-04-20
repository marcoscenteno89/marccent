import React, { Component } from 'react';
import { GetColor, GetRgb, LinGrad } from "./inc/inc";

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
                glass: false
            }
            localStorage.setItem('marccent_active', JSON.stringify(active));
        }
        this.setState(active);
    }

    // update = (i) => {
    //     console.log(i);
    //      this.setState({i}, () => localStorage.setItem('marccent_active', JSON.stringify(i)));
    // }
    updateTheme = (id) => {
        let themes = JSON.parse(localStorage.getItem('marccent_themes'));
        let theme = themes.filter(i => i.id === id);
        let temp = this.state;
        
        this.setState({
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
        }, () => this.storeTheme(this.state));
    }

    isGlass = (i) => this.setState({glass: i}, () => this.storeTheme(this.state));

    isDark = (i) => this.setState({is_dark: i}, () => this.storeTheme(this.state));

    storeTheme = (i) => localStorage.setItem('marccent_active', JSON.stringify(i));

    render() {
        return (
            <ThemeContext.Provider value={{
                active: this.state, 
                isDark: this.isDark,
                isGlass: this.isGlass,
                updateTheme: this.updateTheme,
                getThemes: this.getThemes,
                themeList: JSON.parse(localStorage.getItem('marccent_themes'))
            }}>
                {this.props.children}
            </ThemeContext.Provider>
        )
    }
}