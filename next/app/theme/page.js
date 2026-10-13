'use client';
import { useContext } from "react";
// import { WebForm } from "@/components/client/component";
import { Form, Field, StepForm, Step, Button, Loading, Accordion, AccordionItem, Alert } from "@/components/client/component";
import { ThemeContext } from "@/components/context";
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
    <section className="wrap wrap-fluid grid cols-1 gap-5">
      <div className="wrap bg border round pad">
        <h1>Theme Customizer</h1>
        <div className="square bg-primary">this is a square</div>
        <div><hr/></div>
        <p>Unleash your creativity and make this website truly your own. With the interactive Theme Customizer, you can experiment with different color palettes and see the changes reflected across various components in real-time.</p>
        <h3>Customize Your Experience</h3>
        <p>Color Pickers: Use the color pickers to select your desired hue for the primary and secondary colors. The changes will be applied instantly throughout the website.</p>
        <p>Preview Panes: On the right, you&#39;ll see preview panes showcasing different UI components. As you adjust the colors, observe how the new palette influences buttons, menus, headlines, and more.</p>
        <h3>Bootstrap Theme Color Playground</h3>
        <p>Bored with the default look? With this interactive Theme Color Playground, you can unleash your creativity and play around with different color palettes to create a truly unique, personalized look for your Bootstrap website.</p>
      </div>
      <div className="wrap bg border round pad grid cols-1 gap-3">
        <div className="pad border round bg">
          <h3>Buttons</h3>
          {[
            'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
            'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 
            'outline-warning', 'outline-info', 'outline-light', 'outline-dark'
          ].map((variant) => (
            <Button key={variant}>Select</Button>
          ))}
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
          {[
            'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
          ].map((variant) => (
            <Alert key={variant} variant={variant}>
              This is a {variant} alert with{' '}
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
          <div className="grid cols-3 pad">
            <div className="bg border round grid gap-0">
              <div className="bg-primary pad text-center">
                <i className="h1 fa-solid fa-bomb"></i>
              </div>
              <div className="body grid gap-2">
                <h5>MineSweeper</h5>
                <p>Minesweeper is a single-player logic-based computer game played on a grid of squares. The objective is to clear the grid without detonating any hidden &quot;mines&quot; scattered throughout. Safe squares display numbers indicating the total number of adjacent mines. Players use these clues to strategically identify and flag the mines, progressing through the game by making calculated decisions based on the revealed information. The game offers different difficulty levels and is known for its challenging and strategic gameplay</p>
                <Button icon="arrow-right" href="/apps/minesweeper">Go to Minesweeper</Button>
              </div>
            </div>
              <div className="bg border round grid gap-0">
                <div className="bg-primary pad text-center">
                  <i className="h1 fa-solid fa-hashtag"></i>
                </div>
                <div className="body grid gap-2">
                  <h5>Number Puzzle</h5>
                  <p>A number puzzle is an educational activity that helps children learn and practice various math concepts such as number sequencing, counting, and recognizing numerals. These puzzles often involve matching numbers, counting dots, or arranging number pieces in the correct order. They are designed to enhance problem-solving and cognitive skills while making learning math more engaging for children. Number puzzles can cover a range of numbers, from 0 to 20, 1 to 100, or other specific number ranges.</p>
                  <Button icon="arrow-right" href="/apps/numpuz">Go to Number Puzzle</Button>
                </div>
              </div>
              <div className="bg border round grid gap-0">
                <div className="bg-primary pad text-center">
                  <i className="h1 fa-solid fa-temperature-half"></i>
                </div>
                <div className="body grid gap-2">
                  <h5>Weather App</h5>
                  <p>This weather app is a digital application that provides users with up-to-date weather information for their specific location or other selected locations. It typically offers details such as the current temperature, rain forecast, humidity, wind speed, air quality index, and sunrise/sunset times. Some weather apps also include features like hourly and 10-day forecasts, and maps to visualize weather patterns. These app is designed to help users plan their activities and make informed decisions based on the latest weather conditions</p>
                  <Button icon="arrow-right" href="/apps/weather">Go to Weather App</Button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}