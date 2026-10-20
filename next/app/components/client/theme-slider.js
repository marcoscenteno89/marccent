'use client';
// Theme slider (footer): a card per saved theme to use or delete it, and an Add card that opens a form for a new one.
// Its one CSS rule (the slide width) is THEME CARDS in styles/custom.css.
import { useContext, useState, useEffect } from "react";
import { ToastContext } from '@/components/context';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Form, Modal } from "./component";
import { Field, Button, Icon } from "@/components/server/component";
import { withT } from "./hoc";

const Themes = (props) => {
  const { toast, setToast } = useContext(ToastContext);
  const [ modal, setModal ] = useState(false);
  const current = props.theme.themeList[props.theme.active];
  const status = useStatusColors();

  const add = (data) => {
    setModal(false);
    props.setTheme(props.theme.add(data)); // data: { primary, secondary } from the form
    setToast(toast.add('Theme created successfully', 'success'));
  }

  const remove = (index, event) => {
    event.stopPropagation();
    if (index === props.theme.active) {
      setToast(toast.add('Currently selected theme cannot be deleted', 'danger'));
      return;
    }

    props.setTheme(props.theme.remove(index));
    setToast(toast.add('Theme deleted successfully', 'success'));
  }

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        scrollbar={{ draggable: true }}
        className="theme-slider"
        slidesPerView="auto"
        spaceBetween={16} /* = the default grid gap (--grid-gap, --space: 1rem) */
        navigation
        pagination={{ clickable: true }}
      >
        <SwiperSlide key={`slide-add`}>
          <button type="button" className="bg border round shadow col-center gap-sm h-100 w-100" onClick={() => setModal(true)}>
            <Icon name="circle-plus" />
            <span className="fs-sm">Add theme</span>
          </button>
        </SwiperSlide>
        {props.theme.themeList.map((single, i) => (
          <SwiperSlide key={`slide-${i}`}>
            <ThemeCard
              data={single}
              id={i}
              active={i === props.theme.active}
              status={status}
              update={() => props.update({active:i})}
              remove={remove} />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* New theme: two color pickers, opened by the + button above. They start at the active theme's colors;
          keyed by the active theme so they reset to it after a theme is added or picked. */}
      <Modal title="Add New Theme" show={modal} setShow={setModal}>
        <Form key={props.theme.active} onSubmit={add} submitLabel="Create Theme" submitIcon="circle-plus">
          <Field type="color" name="primary" label="Primary color" defaultValue={current?.primary.hex} required />
          <Field type="color" name="secondary" label="Secondary color" defaultValue={current?.secondary.hex} required />
          <p className="fs-sm opacity-75">Pick the same color twice for a single-color theme.</p>
        </Form>
      </Modal>
      {/* <Status status={status} setStatus={setStatus} /> */}
    </>
  )  
}

// Status colors (settings.css), listed under every theme after its own two; fixed, so not editable here.
// Their hex is read from the CSS variables once mounted (the server can't see stylesheets).
const STATUS = ['danger', 'success', 'info'];
const useStatusColors = () => {
  const [hex, setHex] = useState({});
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    setHex(Object.fromEntries(STATUS.map(name => [name, root.getPropertyValue(`--${name}`).trim()])));
  }, []);
  return STATUS.map(name => ({ name, hex: hex[name] ?? '' }));
};

// A theme as a card (the app card's classes): a square of the theme's gradient (primary at the top, secondary at the
// bottom); under it every color of the palette (a dot of the color, then its hex: primary, secondary, then the status
// colors) and, beside the list, the buttons: use this theme (a paint bucket; pressed while it is the active one),
// then delete it. Layout and look come from grid.css / utils / theme classes; only the colors are inline.
const ThemeCard = (props) => {
  const { data, id, active, status, update, remove } = props;
  const bg = `linear-gradient(to bottom, ${data.primary.hex}, ${data.secondary.hex})`;
  const colors = [
    { name: 'primary', hex: data.primary.hex },
    { name: 'secondary', hex: data.secondary.hex },
    ...status,
  ];
  return (
    <div className="bg border round shadow grid cols-1 gap-0">
      <div className="square" style={{ backgroundImage: bg }} role="img" aria-label={`Theme #${id} colors`} />
      <div className="pad-sm grid auto-cols items-center gap-sm">
        <ul className="grid cols-1 text-uppercase" style={{ '--gap': 'var(--space-xs)', fontSize: 'var(--text-xs)' }}>
          {colors.map(c => (
            <li key={c.name} className="grid auto-cols items-center gap-sm" title={c.name}>
              <span className="circle" style={{ width: '1em', aspectRatio: 1, backgroundColor: c.hex || `var(--${c.name})` }} />
              {c.hex}
            </li>
          ))}
        </ul>
        <div className="grid cols-1 gap-sm">
          <Button icon="fill-drip" className="success" aria-label={`Activate Theme #${id}`}
            title={active ? 'Current theme' : 'Use this theme'} aria-pressed={active} onClick={update} />
          <Button icon="trash-can" className="outline-danger" aria-label={`Delete Theme #${id}`} title="Delete this theme"
            onClick={(event) => remove(id, event)} />
        </div>
      </div>
    </div>
  )
}

const ThemesWT = withT(Themes); // W = With, T = Theme

export { ThemesWT }
