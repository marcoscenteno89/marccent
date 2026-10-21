import { Color } from "@marccent/util/class";
import { get } from "@marccent/util";
import cd from 'lodash/cloneDeep'; // just this function, not all of lodash in the browser bundle
import { Storage } from "@marccent/util/class";
const marccent_server = process.env.NEXT_PUBLIC_SERVER;
const storage = new Storage();

class Theme {
  constructor() {
    if (Theme.instance == null) {
      this.active = 0;
      this.animation = 0;
      this.is_dark = true;
      this.rainbow = false;
      this.glass = false;
      this.dark;
      this.light;
      this.themeList = [];
      Theme.instance = (async () => await this.init())();
    }
    return Theme.instance;
  }

  async init() {
    const theme = storage.get('marccent_theme');
    if (!theme) {
      await this.getThemesFromServer();
    } else {
      this.active = theme.active;
      this.animation = theme.animation;
      this.rainbow = theme.rainbow;
      this.is_dark = theme.is_dark;
      this.glass = theme.glass;
      this.dark = theme.dark;
      this.light = theme.light;
      this.themeList.push(...theme.themeList);
    }
    return this.save();
  }

  async getThemesFromServer() {
    // Gives up after 5s (get() then returns { ok: false }), so an unreachable server falls back to the theme below
    // instead of leaving first-time visitors on loading spinners.
    let data = await get(`${marccent_server}option/?name=theme`, { signal: AbortSignal.timeout(5000) });
    if (data.ok) {
      this.dark = new Color(data.filter(i => i.name === 'theme_dark')[0].value);
      this.light = new Color(data.filter(i => i.name === 'theme_light')[0].value);
      let themelist = data.filter(i => i.name !== 'theme_dark' && i.name !== 'theme_light');
      for (let i of themelist)  {
        let item = {}
        let data = JSON.parse(i.value);
        item.primary = new Color(data.primary);
        item.secondary = new Color(data.secondary);
        this.themeList.push(item);
      }
    } else {
      console.log('Error getting themes from server. Loading hardcoded theme');
      this.dark = new Color('#1a1a1a');
      this.light = new Color('#FFFFFF');
      this.themeList.push({
        primary: new Color('#1f64cf'),
        secondary: new Color('#1ecbe1')
      });
    }
  }

  add(theme) {
    this.themeList.push({
      primary: new Color(theme.primary),
      secondary: new Color(theme.secondary)
    });
    this.active = this.themeList.length - 1;
    return this.save();
  }

  remove(index) {
    this.themeList.splice(index, 1);
    if (index < this.active) this.active = this.active - 1;
    return this.save();
  }

  update(obj) {
    Object.entries(obj).forEach(([key, val]) => this[key] = val );
    return this.save();
  }

  mode() {
    return this.is_dark ? this.dark : this.light;
  }

  rev() {
    return this.is_dark ? this.light : this.dark;
  }

  primary() {
    return this.themeList[this.active].primary;
  }

  secondary() {
    return this.themeList[this.active].secondary;
  }

  active() {
    return this.themeList[this.active];
  }

  rgb(color, opacity) {
    switch (color) {
      case 'primary': {
        let { r, g, b } = this.themeList[this.active].primary.rgb;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }  
      case 'secondary': {
        let { r, g, b } = this.themeList[this.active].secondary.rgb;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      case 'rev': {
        let { r, g, b } = this.rev().rgb;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      default: {
        let { r, g, b } = this.mode().rgb;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    }
  }

  save() {
    storage.set('marccent_theme', this);
    return cd(this);
  }

}


class Toast {
  constructor() {
    if (Toast.instance == null) {
      this.list = [];
      Toast.instance = this;
    }
    return Toast.instance;
  }

  add(msg, type="") {
    this.list.push({
      time: new Date(),
      type: type,
      msg: msg
    });
    return cd(this);
  }

  remove(index) {
    this.list.splice(index, 1);
    return cd(this);
  }
}

// SI => Single Instance, There is only one instance of this class
const themeSI = async () => await new Theme();


const toastSI = new Toast();

export { themeSI, toastSI }