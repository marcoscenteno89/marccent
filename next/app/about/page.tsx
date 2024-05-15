import styles from './page.module.css'
import Image from 'react-bootstrap/Image';

export default function About() {
  return (
    <section className="container-fluid py-5">
      <div className="container-md bg border rounded p-3">
        <div className="shadow mb-4 rounded p-3 bg border">
          <div className="row">
            <div className="col">
              <Image src="/mcr.webp" className="img-fluid rounded" alt="Marcos Centeno's Picture" />
            </div>
            <div className="col-10">
              <h4>Hello</h4>
              <h1>I am Marcos Centeno</h1>
              <p>
                A full-stack web developer with 6+ years of expertise designing, developing,
                and troubleshooting responsive user interfaces and web applications. Skilled
                in Vanilla Javascript, CSS, Python, PHP, and frameworks like React, Django,
                WordPress and Bootstrap.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="shadow p-3 rounded bg border">
              <h4>Skills</h4>
              <ul className="list-group">
                <li className="list-group-item">Javascript</li>
                <li className="list-group-item">CSS</li>
                <li className="list-group-item">HTML 5</li>
                <li className="list-group-item">React</li>
                <li className="list-group-item">Bootstrap</li>
                <li className="list-group-item">PHP</li>
                <li className="list-group-item">Wordpress</li>
                <li className="list-group-item">Python</li>
                <li className="list-group-item">Django</li>
                <li className="list-group-item">Linux</li>
                <li className="list-group-item">GIT</li>
                <li className="list-group-item">Docker</li>
                <li className="list-group-item">MYSQL</li>
                <li className="list-group-item">Hubspot</li>
                <li className="list-group-item">Data Analysis</li>
                <li className="list-group-item">Problem Solving</li>
                <li className="list-group-item">Adaptability</li>
                <li className="list-group-item">Ability to conduct research</li>
                <li className="list-group-item">Willingness to Learn</li>
              </ul>
            </div>
          </div>
          <div className="col-md-8">
            <div className="shadow p-3 rounded bg border">
              <p><strong>Anthem Broadband</strong>, Idaho Falls, ID — Web Developer</p>
              <p>Feb 2016 - <span>PRESENT</span></p>
              <hr />   
              <ul className="list-group bg">
                <li className="list-group-item">Writing reusable, modular JavaScript code following best practices.</li>
                <li className="list-group-item">Consuming RESTful APIs and working with JSON using async/await and promises.</li>
                <li className="list-group-item">Implemented custom smooth scrolling, parallax, and DOM manipulation effects with vanilla JS.</li>
                <li className="list-group-item">Implemented responsive design and optimized web pages for maximum speed and scalability.</li>
                <li className="list-group-item">Configured and optimized Webpack build process for production deployments.</li>
                <li className="list-group-item">Implemented complex page animations and effects.</li>
                <li className="list-group-item">Built and customized WordPress themes.</li>
                <li className="list-group-item">Developed custom WordPress plugins to add specialized functionality.</li>
                <li className="list-group-item">Developed new features and applications using Django framework.</li>
                <li className="list-group-item">Implemented class-based views, custom model fields, querysets.</li>
                <li className="list-group-item">Work with graphic designers to implement animations and effects that aligned with brand style guide.</li>
                <li className="list-group-item">Git version control and pull request workflows.</li>
                <li className="list-group-item">Experience with Linux administration and bash scripting.</li>
                <li className="list-group-item">Knowledge of Docker containerization and Docker Compose.</li>
                <li className="list-group-item">Familiarity with Nginx web server configuration.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center py-3 my-3 border rounded bg">
          <h2>Technologies used in this website</h2>
          <hr />
          <div className="row pt-3">
            <div className="col-3 h1"><i className="fa-brands fa-js"></i></div>
            <div className="col-3 h1"><i className="fa-brands fa-react"></i></div>
            <div className="col-3 h1"><i className="fa-brands fa-css3"></i></div>
            <div className="col-3 h1"><i className="fa-brands fa-bootstrap"></i></div>
          </div>
          <div className="row pt-3">
            <div className="col-3 h1"><i className="fa-brands fa-cloudflare"></i></div>
            <div className="col-3 h1"><i className="fa-solid fa-font-awesome"></i></div>
            <div className="col-3 h1"><i className="fa-brands fa-python"></i></div>
            <div className="col-3 h1"><i className="fa-brands fa-hotjar"></i></div>
          </div>
          <div className="row pt-3">
          <div className="col-3"></div>
            <div className="col-3 h1"><i className="fa-brands fa-docker"></i></div>
            <div className="col-3 h1"><i className="fa-brands fa-ubuntu"></i></div>
            <div className="col-3"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
