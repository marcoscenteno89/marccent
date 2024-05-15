'use client';
import { useState, useEffect, useContext, useRef } from 'react';
import { CanvasManager, canvasObserver } from "@marccent/util/canvas";
import { ThemeContext, ToastContext } from "@/components/context";
import { CssClass, StyleClass } from "@/components/classes";
import { Loading } from "./component";

const withLoader = (Component) => {
  const WithLoaderComponent = (props) => {
    let ready = true;
    for (let i of Object.values(props.require)) {
      if (i === null) ready = false;
    }
    return ready ? <Component {...props} /> : <Loading {...props} />;
  }
  return WithLoaderComponent;
}

const withThemeRead = (Component) => {
  const WithThemeReadComponent = (props) => {
    const { theme } = useContext(ThemeContext);
    return ( 
      <Loading require={[theme]}>
        <Component {...props} theme={theme} />
      </Loading>
    );
  }
  return WithThemeReadComponent;
}

const withTheme = (Component) => {
  const WiththemeComponent = (props) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { toast, setToast } = useContext(ToastContext);
    const update = (obj) => {
      setTheme(theme.update(obj));
      setToast(toast.add('Theme Updated'));
    };
    return (
      <Loading require={[theme, toast]}>
        <Component {...props} theme={theme} update={update} setTheme={setTheme} />
      </Loading>
    );
  }
  return WiththemeComponent;
}

const withComponent = (Component) => {
  const WidthComponentComponent = (props) => {
    const className = new CssClass(props.className);
    const style = new StyleClass();
    return <Component {...props} style={style} className={className} />;
  }
  return WidthComponentComponent;
}

const withCanvas = (Component) => {
  const WithCanvasComponent = (props) => {
    const ref = useRef(null);
    const [ sketch, setSketch ] = useState(null);
    const cls = props.canvasCls ? props.canvasCls.split(' ') : [];
    cls.push('canvas-container');
    useEffect(() => {
      const rainbow = props.theme.rainbow;
      if (rainbow) props.className.add('linear-gradient');
      if (!rainbow) props.className.remove('linear-gradient');
      const init = async () => {
        const data = {};
        data.p5 = (await import("p5")).default;
        data.sketch = new data.p5((p) => data.p = p);
        data.canvas = new CanvasManager(data.p5, data.p, ref.current);
        canvasObserver(data.p, ref.current);
        setSketch(data);
      }
      init();
    }, []);
    return (
      <div style={props.style} className={cls.join(' ')}>
        <canvas style={props.style} className={props.className.print()} ref={ref}></canvas>
        <Loading require={[sketch]}>
          <Component {...props} cavasRef={ref} sketch={sketch} />
        </Loading>
      </div>
    );
  }
  return WithCanvasComponent;
}

const withC= (Component) => withComponent(Component);
const withT= (Component) => withTheme(Component);
const withCTRC = (Component) => withComponent(withThemeRead(withCanvas(Component)));
const withCT = (Component) => withComponent(withTheme(Component));
const withCTR = (Component) => withComponent(withThemeRead(Component));

export { withComponent, withTheme, withCanvas, withCTRC, withCT, withC, withT, withCTR }