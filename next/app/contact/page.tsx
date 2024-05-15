import Link from "next/link";
import { ContactUsForm } from "@/components/client/component";
import MapWTCL from "@/components/client/map";

export default function Contact() {

  return (
    <section className="container-fluid py-5 m-0 linear-gradient">
      <div className="container-md bg border rounded shadow overflow-hidden">
        <div className="row">
          <div className="col-md-7 p-0">
            <MapWTCL className="h-100" zoom={10} />
          </div>
          <div className="col-md-5 p-5">
            <h1>Get in Touch</h1>
            <p>I&apos;m always excited to discuss new projects, job opportunities, and other potential collaborations. Whether you have a question about my services, want to explore working together, or just want to connect - don&apos;t hesitate to reach out!</p>
            <ContactUsForm />
            <ul className="navbar-nav flex-row flex-wrap ms-md-auto border rounded justify-content-center">
              <li className="nav-item col-12 col-md-auto">
                <Link className="nav-link" href="mailto:marcoscenteno89@gmail.com" target="_blank">
                  <i className="fa-solid fa-message"></i>
                </Link>
              </li>
              <li className="nav-item py-2 py-lg-1 col-12 col-md-auto">
                <div className="vr d-none d-md-flex h-100 mx-md-2"></div>
                <hr className="d-md-none my-2" />
              </li>
              <li className="nav-item col-12 col-md-auto">
                <Link className="nav-link" href="https://codepen.io/marcos-centeno/pens/public" target="_blank">
                  <i className="fa-brands fa-codepen"></i>
                </Link>
              </li>
              <li className="nav-item py-2 py-lg-1 col-12 col-md-auto">
                <div className="vr d-none d-md-flex h-100 mx-md-2"></div>
                <hr className="d-md-none my-2" />
              </li>
              <li className="nav-item col-12 col-md-auto">
                <Link className="nav-link" href="https://www.linkedin.com/in/marcos-centeno-0b1a7b65/" target="_blank">
                  <i className="fa-brands fa-linkedin"></i>
                </Link>
              </li>
              <li className="nav-item py-2 py-lg-1 col-12 col-md-auto">
                <div className="vr d-none d-md-flex h-100 mx-md-2"></div>
                <hr className="d-md-none my-2" />
              </li>
              <li className="nav-item col-12 col-md-auto">
                <Link className="nav-link" href="https://github.com/marcoscenteno89" target="_blank">
                  <i className="fa-brands fa-github"></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
