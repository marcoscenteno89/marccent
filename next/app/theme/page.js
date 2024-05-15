'use client';
import Link from "next/link";
import { useContext } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { WebFormWC } from "@/components/client/component";
import { ThemeContext } from "@/components/context";
import MapWTCL from "@/components/client/map";
import { Loading } from "@/components/client/component";

export default function ThemePage() {
  const contextVal = useContext(ThemeContext);
  if (!contextVal) return <Loading require={[]} />;
  const { theme } = contextVal;
  if (!theme) return <Loading require={[]} />;
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
    <section className="container-fluid py-5">
      <div className="container-md bg border rounded p-3 mb-5">
        <h1>Theme Customizer</h1>
        <div><hr /></div>
        <p>Unleash your creativity and make this website truly your own. With the interactive Theme Customizer, you can experiment with different color palettes and see the changes reflected across various components in real-time.</p>
        <h3>Customize Your Experience</h3>
        <p>Color Pickers: Use the color pickers to select your desired hue for the primary and secondary colors. The changes will be applied instantly throughout the website.</p>
        <p>Preview Panes: On the right, you&#39;ll see preview panes showcasing different UI components. As you adjust the colors, observe how the new palette influences buttons, menus, headlines, and more.</p>
        <h3>Bootstrap Theme Color Playground</h3>
        <p>Bored with the default look? With this interactive Theme Color Playground, you can unleash your creativity and play around with different color palettes to create a truly unique, personalized look for your Bootstrap website.</p>
      </div>
      <div className="container-md bg border rounded p-3">

        <div className="p-3 border rounded my-3 bg">
          <h3>Buttons</h3>
          {[
            'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
            'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 
            'outline-warning', 'outline-info', 'outline-light', 'outline-dark'
          ].map((variant) => (
            <Button key={variant} variant={`${variant} m-1`}>Select</Button>
          ))}
        </div>

        <div className="p-3 border rounded my-3">
          <h3>Basic Form</h3>
          <div className="p-3 border rounded my-3">
            <WebFormWC className="col-12" callBack={onClick}>
              <input type="text" name="street" required />
              <input type="number" name="city" required />
              <input type="text" name="state" required />
              <input type="date" className="datepicker" name="date" required />
              <input type="range" name="age" required />
              <input type="password" name="password" required />
              <input type="text" name="message" as="textarea" rows={5} required />
            </WebFormWC>
          </div>
        </div>

        <div className="p-3 border rounded my-3 bg">
          {[
            'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
          ].map((variant, i) => (
            <ProgressBar 
              key={i} className="mb-1" now={`${i+2}0`} variant={variant} label={`${i+2}0%`} />
          ))}
        </div>

        <div className="p-3 border rounded my-3 bg">
          <h3>Alerts</h3>
          {[
            'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
          ].map((variant) => (
            <Alert key={variant} variant={`${variant} p-2 mb-2`}>
              This is a {variant} alert with{' '}
              <Alert.Link href="#">an example link</Alert.Link>. Give it a click if
              you like.
            </Alert>
          ))}
        </div>

        <div className="p-3 border rounded my-3 bg">
          <h3>Accordion</h3>
          <Accordion defaultActiveKey="0">
            {['primary', 'secondary', 'success'].map((variant, i) => (
              <Accordion.Item key={i} eventKey={i}>
                <Accordion.Header>Accordion Item #{i + 1}</Accordion.Header>
                <Accordion.Body>
                  <strong>This is the first item&#39;s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It&#39;s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </Accordion.Body>
              </Accordion.Item>
            ))}
            </Accordion>
        </div>

        <div className="p-3 border rounded my-3 bg">
          <h3>Primary Color</h3>
          <ListGroup as="ul">
            {pl.map((i, index) => (
              <ListGroupItem as="li" key={index} style={{background: i.hex}} className="p-1 mb-1">
                {i.hex}
              </ListGroupItem>
            ))}
            <ListGroupItem as="li" style={{background: theme.primary().hex}} className="p-1 mb-1">
            {theme.primary().hex}
            </ListGroupItem>
            {pd.map((i, index) => (
              <ListGroupItem as="li" key={index} style={{background: i.hex}} className="p-1 mb-1">
                {i.hex}
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>

        <div className="p-3 border rounded my-3 bg">
        <h3>Secondary Color</h3>
          <ListGroup as="ul">
            {sl.map((i, index) => (
              <ListGroupItem as="li" key={index} style={{background: i.hex}} className="p-1 mb-1">
                {i.hex}
              </ListGroupItem>
            ))}
            <ListGroupItem as="li" style={{background: theme.secondary().hex}} className="p-1 mb-1">
              {theme.secondary().hex}
            </ListGroupItem>
            {sd.map((i, index) => (
              <ListGroupItem as="li" key={index} style={{background: i.hex}} className="p-1 mb-1">
                {i.hex}
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>

        <div className="p-3 border rounded my-3 bg">
        <h3>Dark Color</h3>
          <ListGroup as="ul">
            {dl.map((i, index) => (
              <ListGroupItem as="li" key={index} style={{background: i.hex}} className="p-1 mb-1">
                {i.hex}
              </ListGroupItem>
            ))}
            <ListGroupItem as="li" style={{background: theme.dark.hex}} className="p-1 mb-1">
              {theme.dark.hex}
            </ListGroupItem>
            {dd.map((i, index) => (
              <ListGroupItem as="li" key={index} style={{background: i.hex}} className="p-1 mb-1">
                {i.hex}
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>

        <div className="p-3 border rounded my-3 bg">
          <h3>Light Color</h3>
          <ListGroup as="ul">
            {ll.map((i, index) => (
              <ListGroupItem as="li" key={index} style={{background: i.hex}} className="p-1 mb-1">
                {i.hex}
              </ListGroupItem>
            ))}
            <ListGroupItem as="li" style={{background: theme.light.hex}} className="p-1 mb-1">
              {theme.light.hex}
            </ListGroupItem>
            {ld.map((i, index) => (
              <ListGroupItem as="li" key={index} style={{background: i.hex}} className="p-1 mb-1">
                {i.hex}
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
        <div className="p-3 border rounded my-3 bg">
          <h3>Map</h3>
          <MapWTCL className="rounded" zoom={10} />
        </div>

        <div className="p-3 border rounded my-3 bg">
          <h3>App List</h3>
          <div className="row p-3">
            <div className="col-md-4">
            <div className="card">
              <div className="bg-primary p-3 text-center">
                <i className="h1 fa-solid fa-bomb"></i>
              </div>
              <div className="card-body">
                <h5 className="card-title">MineSweeper</h5>
                <p className="card-text">Minesweeper is a single-player logic-based computer game played on a grid of squares. The objective is to clear the grid without detonating any hidden &quot;mines&quot; scattered throughout. Safe squares display numbers indicating the total number of adjacent mines. Players use these clues to strategically identify and flag the mines, progressing through the game by making calculated decisions based on the revealed information. The game offers different difficulty levels and is known for its challenging and strategic gameplay</p>
                <Link href="/apps/minesweeper" className="btn btn-primary">Go to Minesweeper</Link>
              </div>
            </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="bg-primary p-3 text-center">
                  <i className="h1 fa-solid fa-hashtag"></i>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Number Puzzle</h5>
                  <p className="card-text">A number puzzle is an educational activity that helps children learn and practice various math concepts such as number sequencing, counting, and recognizing numerals. These puzzles often involve matching numbers, counting dots, or arranging number pieces in the correct order. They are designed to enhance problem-solving and cognitive skills while making learning math more engaging for children. Number puzzles can cover a range of numbers, from 0 to 20, 1 to 100, or other specific number ranges.</p>
                  <Link href="/apps/numpuz" className="btn btn-primary">Go to Number Puzzle</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="bg-primary p-3 text-center">
                  <i className="h1 fa-solid fa-temperature-half"></i>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Weather App</h5>
                  <p className="card-text">This weather app is a digital application that provides users with up-to-date weather information for their specific location or other selected locations. It typically offers details such as the current temperature, rain forecast, humidity, wind speed, air quality index, and sunrise/sunset times. Some weather apps also include features like hourly and 10-day forecasts, and maps to visualize weather patterns. These app is designed to help users plan their activities and make informed decisions based on the latest weather conditions</p>
                  <Link href="/apps/weather" className="btn btn-primary">Go to Weather App</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}