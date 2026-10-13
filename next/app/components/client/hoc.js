'use client';
import { useState, useEffect, useContext, useRef } from 'react';
import { CanvasManager, canvasObserver } from "@marccent/util/canvas";
import { ThemeContext, ToastContext } from "@/components/context";
import { cx, Loading } from "./component";

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

const withCanvas = (Component) => {
  const WithCanvasComponent = (props) => {
    const ref = useRef(null);
    const [ sketch, setSketch ] = useState(null);
    useEffect(() => {
      // const rainbow = props.theme.rainbow;
      // c_cls.add(rainbow ? 'linear-gradient' : '').remove(rainbow ? '' : 'linear-gradient');
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
      <>
        <canvas style={props.style} className={cx(props.className, 'canvas')} ref={ref}></canvas>
        <Loading require={[sketch]}>
          <Component {...props} cavasRef={ref} sketch={sketch} />
        </Loading>
      </>
    );
  }
  return WithCanvasComponent;
}

const withT= (Component) => withTheme(Component);
const withTRC = (Component) => withThemeRead(withCanvas(Component));
const withTR = (Component) => withThemeRead(Component);

export { withTheme, withCanvas, withTRC, withT, withTR }