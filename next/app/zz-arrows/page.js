'use client';
// TEMPORARY preview: arrow styles for the Swiper sliders. Delete this folder after picking one.
import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SLIDES = ['Blob', 'Network Loop', 'Wave', 'Particle Flowfield', 'Orbit', 'Fire', 'Aurora', 'Rain'];
const Cards = () => SLIDES.map((n, i) => (
  <SwiperSlide key={n} style={{ width: '14rem', height: 'auto' }}>
    <div className="bg border round shadow pad col-center text-center h-100" style={{ minHeight: '8rem' }}>
      <strong>{i + 1}</strong><small className="opacity-75">{n}</small>
    </div>
  </SwiperSlide>
));

// Custom arrows: Swiper drives our own buttons (refs), so they can sit anywhere and use the theme's Button.
const useNav = () => {
  const prev = useRef(null), next = useRef(null), dots = useRef(null), swiper = useRef(null);
  // After mount: buttons placed after the slider get their refs only after Swiper has started, so connect them here.
  useEffect(() => {
    const s = swiper.current; if (!s) return;
    s.params.navigation = { ...s.params.navigation, prevEl: prev.current, nextEl: next.current };
    s.navigation.destroy(); s.navigation.init(); s.navigation.update();
    if (dots.current) { s.params.pagination = { ...s.params.pagination, el: dots.current }; s.pagination.destroy(); s.pagination.init(); s.pagination.render(); s.pagination.update(); }
  }, []);
  return { prev, next, dots, wire: (s) => { swiper.current = s; } };
};

const Example = ({ n, title, note, children }) => (
  <section className="grid cols-1 gap-sm">
    <h2 className="h4">{n}. {title}</h2>
    <p className="opacity-75 fs-sm">{note}</p>
    {children}
  </section>
);

export default function ArrowsPreview() {
  const c = useNav(), d = useNav(), e = useNav(), f = useNav(), g = useNav();
  return (
    <div className="wrap grid cols-1 gap-lg pad-y-lg">
      {/* Scoped to this preview: restyles Swiper's own arrows for examples 1 and 2. */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ex-tinted { --swiper-navigation-color: var(--body-color); --swiper-navigation-size: 1rem; }
        .ex-tinted .swiper-button-prev, .ex-tinted .swiper-button-next {
          width: 2.5rem; height: 2.5rem; border-radius: 50%; background: color-mix(in srgb, var(--body-bg) 80%, transparent);
          border: var(--border-width) solid var(--border-color); box-shadow: var(--shadow); backdrop-filter: blur(6px); }
        .ex-fade { --swiper-navigation-color: var(--body-color); --swiper-navigation-size: 1.5rem; }
        .ex-fade .swiper-button-prev, .ex-fade .swiper-button-next { opacity: 0; transition: opacity var(--duration); height: 100%; top: 0; margin: 0; width: 4rem; }
        .ex-fade .swiper-button-prev { left: 0; background: linear-gradient(to right, var(--body-bg), transparent); }
        .ex-fade .swiper-button-next { right: 0; background: linear-gradient(to left, var(--body-bg), transparent); }
        .ex-fade:hover .swiper-button-prev:not(.swiper-button-disabled), .ex-fade:hover .swiper-button-next:not(.swiper-button-disabled) { opacity: 1; }
        .ex-fade .swiper-button-disabled { opacity: 0 !important; }
        .ex-out { --swiper-navigation-color: var(--body-color); --swiper-navigation-size: 1.5rem; }
        .ex-out > .swiper-button-prev, .ex-out > .swiper-button-next {
          position: static; margin: 0; width: 2.5rem; height: auto; align-self: stretch;
          opacity: 0; transition: opacity var(--duration), translate var(--duration); }
        .ex-out > .swiper-button-prev { translate: .75rem 0; }
        .ex-out > .swiper-button-next { translate: -.75rem 0; }
        .ex-out:hover > :is(.swiper-button-prev, .swiper-button-next):not(.swiper-button-disabled) { opacity: 1; translate: 0 0; }
        .ex-out > .swiper-button-disabled { opacity: 0 !important; pointer-events: none; }
        .ex-custom > .swiper-button-prev, .ex-custom > .swiper-button-next { display: none; } /* our own buttons drive it */
      ` }} />

      <Example n={0} title="Current" note="Swiper's default arrows in --swiper-theme-color (the primary blue), over the slides.">
        <Swiper modules={[Navigation, A11y]} slidesPerView="auto" spaceBetween={32} navigation className="w-100">
          {Cards()}
        </Swiper>
      </Example>

      <Example n={1} title="Neutral circles on the edges" note="Same spot, but small text-colored chevrons in a frosted circle with the page's border and shadow.">
        <Swiper modules={[Navigation, A11y]} slidesPerView="auto" spaceBetween={32} navigation className="w-100 ex-tinted">
          {Cards()}
        </Swiper>
      </Example>

      <Example n={2} title="Faded edges, on hover" note="No arrows at rest; hovering the slider fades in a chevron over a soft page-colored edge.">
        <Swiper modules={[Navigation, A11y]} slidesPerView="auto" spaceBetween={32} navigation className="w-100 ex-fade">
          {Cards()}
        </Swiper>
      </Example>

      <Example n={7} title="Faded arrows, outside the slides" note="Like 2, but each arrow has its own column beside the slider, so it never covers a slide; it fades and slides in on hover.">
        <div className="grid gap-0 ex-out" style={{ gridTemplateColumns: 'auto minmax(0, 1fr) auto' }}>
          <div ref={g.prev} className="swiper-button-prev" />
          <Swiper modules={[Navigation, A11y]} slidesPerView="auto" spaceBetween={32} onSwiper={g.wire} navigation={{}} className="w-100 ex-custom">
            {Cards()}
          </Swiper>
          <div ref={g.next} className="swiper-button-next" />
        </div>
      </Example>

      <Example n={3} title="Theme buttons below" note="Arrows move below the slides, centered, as the site's own icon buttons (holographic hover).">
        <Swiper modules={[Navigation, A11y]} slidesPerView="auto" spaceBetween={32} onSwiper={c.wire}
          navigation={{}} className="w-100 ex-custom">
          {Cards()}
        </Swiper>
        <div className="grid auto-cols cols-center gap-sm">
          <button ref={c.prev} type="button" className="btn circle" aria-label="Previous"><i className="fa-solid fa-chevron-left" aria-hidden="true" /></button>
          <button ref={c.next} type="button" className="btn circle" aria-label="Next"><i className="fa-solid fa-chevron-right" aria-hidden="true" /></button>
        </div>
      </Example>

      <Example n={4} title="Header controls" note="A title row with outline prev / next buttons at its end (app-store style).">
        <div className="header">
          <strong className="h5">Animations</strong>
          <div className="grid auto-cols gap-sm">
            <button ref={d.prev} type="button" className="btn outline-primary" aria-label="Previous"><i className="fa-solid fa-chevron-left" aria-hidden="true" /></button>
            <button ref={d.next} type="button" className="btn outline-primary" aria-label="Next"><i className="fa-solid fa-chevron-right" aria-hidden="true" /></button>
          </div>
        </div>
        <Swiper modules={[Navigation, A11y]} slidesPerView="auto" spaceBetween={32} onSwiper={d.wire} navigation={{}} className="w-100 ex-custom">
          {Cards()}
        </Swiper>
      </Example>

      <Example n={5} title="Pill counter" note="One rounded bar below: previous, '2 / 8', next. Compact, reads like a pager.">
        <Swiper modules={[Navigation, Pagination, A11y]} slidesPerView="auto" spaceBetween={32} onSwiper={e.wire}
          navigation={{}} pagination={{ type: 'fraction' }} className="w-100 ex-custom">
          {Cards()}
        </Swiper>
        <div className="center gap-0 bg border shadow-sm" style={{ justifySelf: 'center', borderRadius: '99px', overflow: 'hidden' }}>
          <button ref={e.prev} type="button" className="btn" style={{ border: 0, borderRadius: 0 }} aria-label="Previous"><i className="fa-solid fa-arrow-left" aria-hidden="true" /></button>
          <div ref={e.dots} className="fs-sm fw-bold" style={{ position: 'static', width: 'auto', paddingInline: 'var(--space-sm)' }} />
          <button ref={e.next} type="button" className="btn" style={{ border: 0, borderRadius: 0 }} aria-label="Next"><i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>
        </div>
      </Example>

      <Example n={6} title="Gradient arrows on the sides" note="Filled theme-gradient circles sitting just outside the slider, vertically centered.">
        <div className="grid items-center gap-sm" style={{ gridTemplateColumns: 'auto minmax(0, 1fr) auto' }}>
          <button ref={f.prev} type="button" className="btn gradient circle" aria-label="Previous"><i className="fa-solid fa-angle-left" aria-hidden="true" /></button>
          <Swiper modules={[Navigation, A11y]} slidesPerView="auto" spaceBetween={32} onSwiper={f.wire}
            navigation={{}} className="w-100 ex-custom">
            {Cards()}
          </Swiper>
          <button ref={f.next} type="button" className="btn gradient circle" aria-label="Next"><i className="fa-solid fa-angle-right" aria-hidden="true" /></button>
        </div>
      </Example>
    </div>
  );
}
