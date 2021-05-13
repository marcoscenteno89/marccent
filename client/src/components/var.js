import React, { Component } from 'react';
import { RevColor, GetMode, GetRgb, LinGrad } from "./inc/inc";

export const ThemeContext = React.createContext();

export class ThemeProvider extends Component {

  state = {
    id: 0
  }

  getThemes = async () => {
    const url = process.env.REACT_APP_STRAPIURL;
    let theme = JSON.parse(localStorage.getItem('marccent_theme'));
    if (!theme) {
      theme = {};
      const themeJson = await fetch(`${url}themes/`);
      const darkJson = await fetch(`${url}options?name=theme_dark`);
      const lightJson = await fetch(`${url}options?name=theme_light`);
      theme.list = await themeJson.json();
      let dark = await darkJson.json();
      let light = await lightJson.json();
      theme.id = theme.list[0].id;
      theme.rgb = {
        dark: GetRgb(dark[0].value),
        light: GetRgb(light[0].value),
        primary: GetRgb(theme.list[0].primary),
        secondary: GetRgb(theme.list[0].secondary)
      };
      theme.hex = {
        dark: dark[0].value,
        light: light[0].value,
        primary: theme.list[0].primary,
        secondary: theme.list[0].secondary
      };
      theme.grad = LinGrad(theme.list[0].primary, theme.list[0].secondary);
      theme.is_dark = true;
      theme.glass = false;
      theme.mode = GetMode(theme, 1);
      theme.rev = RevColor(theme, 1);
    }
    
    this.setState(theme, () => this.storeTheme(this.state));
  }

  newState = n => {
    // let active = {
    //   id: theme[0].id,
    //   rgb: {
    //     dark: temp.rgb.dark,
    //     light: temp.rgb.light,
    //     primary: GetRgb(theme[0].primary),
    //     secondary: GetRgb(theme[0].secondary)
    //   },
    //   hex: {
    //     dark: temp.hex.dark,
    //     light: temp.hex.light,
    //     primary: theme[0].primary,
    //     secondary: theme[0].secondary
    //   },
    //   grad: LinGrad(theme[0].primary, theme[0].secondary)
    // }
    // active.mode = GetMode(active, 1);
    // active.rev = RevColor(active, 1);
    // this.setState(active, () => this.storeTheme(this.state));
  }

  addTheme = theme => {
    console.log(theme);
    let temp = this.state.list;
    let largest = this.state.list[0].id;
    for (let i of this.state.list) {
      if (i.id > largest) largest = i.id
    }
    delete theme.showForm;
    theme.id = largest + 1;
    temp.push(theme);
    this.setState({
      list: temp
    }, () => {
      this.updateTheme(theme.id);
      this.storeTheme(this.state);
    });
  }

  removeTheme = (id) => {

    let updated = this.state.list.filter(theme => theme.id !== id);
    console.log(id);
    console.log(updated);
    return;
    // let temp = this.state;
    // let theme = themes[0];
    // console.log(updated, id, this.state); 
    // localStorage.setItem('marccent_themes', JSON.stringify(updated));
  }

  updateTheme = (id) => {
    let current = this.state.list.filter(i => i.id === id)[0];
    let temp = this.state;
    this.setState({
      id: current.id,
      rgb: {
        dark: temp.rgb.dark,
        light: temp.rgb.light,
        primary: GetRgb(current.primary),
        secondary: GetRgb(current.secondary)
      },
      hex: {
        dark: temp.hex.dark,
        light: temp.hex.light,
        primary: current.primary,
        secondary: current.secondary
      },
      grad: LinGrad(current.primary, current.secondary)
    }, () => this.storeTheme(this.state));
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

  storeTheme = (i) => localStorage.setItem('marccent_theme', JSON.stringify(i));

  render() {
    return (
      <ThemeContext.Provider value={{
        theme: this.state, 
        isDark: this.isDark,
        isGlass: this.isGlass,
        updateTheme: this.updateTheme,
        getThemes: this.getThemes,
        addTheme: this.addTheme,
        removeTheme:this.removeTheme,
      }}>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}