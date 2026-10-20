'use client';
import { useContext } from "react";
// import { WebForm } from "@/components/client/component";
import { Form, StepForm, Step } from "@/components/client/component";
import { Field, Input, Button, Loading, Accordion, AccordionItem, Alert } from "@/components/server/component";
import { ThemeContext } from "@/components/context";
import { apps } from "@/components/server/list";
import AppCard from "@/components/server/app-card";
import MapWTR from "@/components/client/map";

export default function ThemePage() {
  const contextVal = useContext(ThemeContext);
  if (!contextVal) return <Loading require={[]}/>;
  const { theme } = contextVal;
  if (!theme) return <Loading require={[]}/>;
  const pl = theme.primary().lighter.reverse();
  const pd = theme.primary().darker;
  const sl = theme.secondary().lighter.reverse();
  const sd = theme.secondary().darker;
  const dl = theme.dark.lighter.reverse();
  const dd = theme.dark.darker;
  const ll = theme.light.lighter.reverse();
  const ld = theme.light.darker;
  const onClick = (data) => console.log(data);

  return (
    <section className="wrap wrap-fluid grid cols-1 gap-lg">
      <div className="wrap bg border round pad">
        <h1>Theme Customizer</h1>
        <div><hr/></div>
        <p>Unleash your creativity and make this website truly your own. With the interactive Theme Customizer, you can experiment with different color palettes and see the changes reflected across various components in real-time.</p>
        <h3>Customize Your Experience</h3>
        <p>Color Pickers: Use the color pickers to select your desired hue for the primary and secondary colors. The changes will be applied instantly throughout the website.</p>
        <p>Preview Panes: On the right, you&#39;ll see preview panes showcasing different UI components. As you adjust the colors, observe how the new palette influences buttons, menus, headlines, and more.</p>
        <h3>Theme Color Playground</h3>
        <p>Bored with the default look? With this interactive Theme Color Playground, you can unleash your creativity and play around with different color palettes to create a truly unique, personalized look for this website.</p>
      </div>
      <div className="wrap bg border round pad grid cols-1">
        <div className="pad border round bg">
          <h3>Buttons</h3>
          <div className="grid auto-cols gap-sm">
            <Button icon="star">Icon and label</Button>
            <Button icon="star" aria-label="Icon only" />
            <Button>Text link</Button>
          </div>
        </div>

        <div className="pad border round">
          <h3>Basic Form</h3>
          <div className="pad border round">
            {/* <WebForm className="col-12" callBack={onClick}>
              <input type="text" name="street" required/>
              <input type="number" name="city" required/>
              <input type="text" name="state" required/>
              <input type="date" className="datepicker" name="date" required/>
              <input type="range" name="age" required/>
              <input type="password" name="password" required/>
              <input type="text" name="message" as="textarea" rows={5} required/>
            </WebForm> */}

            <Form onSubmit={onClick}>
              <Field type="text" name="street" required/>
              <Field type="number" name="city" required/>
              <Field type="text" name="state" required/>
              <Field type="date" name="date" required/>
              <Field type="range" name="age" required/>
              <Field type="password" name="password" required/>
              <Field name="message" as="textarea" rows={5} required/>
            </Form>

            <h3>Inline Form</h3>
            <Form className="grid inline-form" onSubmit={onClick} submitLabel="Search" submitIcon="magnifying-glass">
              <Input name="city" required />
              <Input name="state" />
              <Input name="zip" inputMode="numeric" />
            </Form>

            <h3>Step Form</h3>
            <StepForm onSubmit={onClick}>
              <Step name="Contact">
                <Field name="name" required/>
                <Field name="email" type="email" required/>
              </Step>
              <Step name="Address">
                <Field name="street"/>
                <Field name="city" required/>
              </Step>
              <Step name="Message">
                <Field name="message" as="textarea" rows={4} required/>
              </Step>
            </StepForm>
          </div>
        </div>

        <div className="pad border round bg">
          {[
            'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
          ].map((variant, i) => (
            <progress key={variant} className="w-100" value={(i + 2) * 10} max={100}
              aria-label={`${variant} ${(i + 2) * 10}%`} style={{ accentColor: `var(--${variant})` }} />
          ))}
        </div>

        <div className="pad border round bg">
          <h3>Alerts</h3>
          {[{ tone: 'primary' }, { tone: 'secondary' }, { className: 'bg-gradient-lighter' }].map((props) => (
            <Alert key={props.tone ?? props.className} {...props}>
              This is a {props.tone ?? props.className} alert with{' '}
              <a href="#" className="alert-link">an example link</a>. Give it a click if
              you like.
            </Alert>
          ))}
        </div>

        <div className="pad border round bg">
          <h3>Accordion</h3>
          <Accordion>
            {['primary', 'secondary', 'success'].map((variant, i) => (
              <AccordionItem key={i} header={`Accordion Item #${i + 1}`}>
                  <strong>This is the first item&#39;s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It&#39;s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
              </AccordionItem>
            ))}
            </Accordion>
        </div>

        <div className="pad border round bg">
          <h3>Primary Color</h3>
          <ul className="grid cols-1 gap-0 divide border round" style={{ '--pad': '.5rem 1rem' }}>
            {pl.map((i, index) => (
              <li key={index} className="pad" style={{background: i.hex}}>
                {i.hex}
              </li>
            ))}
            <li className="pad" style={{background: theme.primary().hex}}>
            {theme.primary().hex}
            </li>
            {pd.map((i, index) => (
              <li key={index} className="pad" style={{background: i.hex}}>
                {i.hex}
              </li>
            ))}
          </ul>
        </div>

        <div className="pad border round bg">
        <h3>Secondary Color</h3>
          <ul className="grid cols-1 gap-0 divide border round" style={{ '--pad': '.5rem 1rem' }}>
            {sl.map((i, index) => (
              <li key={index} className="pad" style={{background: i.hex}}>
                {i.hex}
              </li>
            ))}
            <li className="pad" style={{background: theme.secondary().hex}}>
              {theme.secondary().hex}
            </li>
            {sd.map((i, index) => (
              <li key={index} className="pad" style={{background: i.hex}}>
                {i.hex}
              </li>
            ))}
          </ul>
        </div>

        <div className="pad border round bg">
        <h3>Dark Color</h3>
          <ul className="grid cols-1 gap-0 divide border round" style={{ '--pad': '.5rem 1rem' }}>
            {dl.map((i, index) => (
              <li key={index} className="pad" style={{background: i.hex}}>
                {i.hex}
              </li>
            ))}
            <li className="pad" style={{background: theme.dark.hex}}>
              {theme.dark.hex}
            </li>
            {dd.map((i, index) => (
              <li key={index} className="pad" style={{background: i.hex}}>
                {i.hex}
              </li>
            ))}
          </ul>
        </div>

        <div className="pad border round bg">
          <h3>Light Color</h3>
          <ul className="grid cols-1 gap-0 divide border round" style={{ '--pad': '.5rem 1rem' }}>
            {ll.map((i, index) => (
              <li key={index} className="pad" style={{background: i.hex}}>
                {i.hex}
              </li>
            ))}
            <li className="pad" style={{background: theme.light.hex}}>
              {theme.light.hex}
            </li>
            {ld.map((i, index) => (
              <li key={index} className="pad" style={{background: i.hex}}>
                {i.hex}
              </li>
            ))}
          </ul>
        </div>
        <div className="pad border round bg">
          <h3>Map</h3>
          <MapWTR className="round" zoom={10}/>
        </div>

        <div className="pad border round bg">
          <h3>App List</h3>
          {/* Same cards as the home and apps pages, from the one apps list. */}
          <div className="grid cols-3">
            {apps.map(app => <AppCard key={app.url} app={app} />)}
          </div>
        </div>
      </div>
    </section>
  );
}