import Link from 'next/link';
import { RainbowModeWCT, ThemeModeWCT, GlassModeWCT } from '../components/client/theme';

export default function Header() {
  return (
    <header className="container-fluid sticky-md-top bg border-bottom">
      <nav className="navbar navbar-expand-md">
        <Link className="navbar-brand text-primary" href="/">Marccent</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" href="/about">About Me</Link>
            </li>
            <li className="nav-item py-2 py-lg-1 col-12 col-md-auto">
              <div className="vr d-none d-md-flex h-100 mx-md-2"></div>
              <hr className="d-md-none my-2" />
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/apps" >Apps</Link>
            </li>
            <li className="nav-item py-2 py-lg-1 col-12 col-md-auto">
              <div className="vr d-none d-md-flex h-100 mx-md-2"></div>
              <hr className="d-md-none my-2" />
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/theme" >Theme</Link>
            </li>
            <li className="nav-item py-2 py-lg-1 col-12 col-md-auto">
              <div className="vr d-none d-md-flex h-100 mx-md-2"></div>
              <hr className="d-md-none my-2" />
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/contact" >Contact</Link>
            </li>
          </ul>
          <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
            <li className="nav-item col-12 col-md-auto">
              <Link className="nav-link" href="https://codepen.io/marcos-centeno/pens/public" target="_blank">
                <i className="fa-brands fa-codepen"></i>
              </Link>
            </li>
            <li className="nav-item col-12 col-md-auto">
              <Link className="nav-link" href="https://www.linkedin.com/in/marcos-centeno-0b1a7b65/" target="_blank">
                <i className="fa-brands fa-linkedin"></i>
              </Link>
            </li>
            <li className="nav-item col-12 col-md-auto">
              <Link className="nav-link" href="https://github.com/marcoscenteno89" target="_blank">
                <i className="fa-brands fa-github"></i>
              </Link>
            </li>
            <li className="nav-item py-2 py-lg-1 col-12 col-md-auto">
              <div className="vr d-none d-md-flex h-100 mx-md-2"></div>
              <hr className="d-md-none my-2" />
            </li>
            <GlassModeWCT />
            <li className="nav-item py-2 py-lg-1 col-12 col-md-auto">
              <div className="vr d-none d-md-flex h-100 mx-md-2"></div>
              <hr className="d-md-none my-2" />
            </li>
            {/* <RainbowModeWCT className="fa-solid" /> */}
            {/* <li className="nav-item py-2 py-lg-1 col-12 col-md-auto">
              <div className="vr d-none d-md-flex h-100 mx-md-2"></div>
              <hr className="d-md-none my-2 text-white-50" />
            </li> */}
            <ThemeModeWCT className="" />
            <li className="nav-item py-2 py-lg-1 col-12 col-md-auto">
              <div className="vr d-none d-md-flex h-100 mx-md-2"></div>
              <hr className="d-md-none my-2" />
            </li>
            <li className="nav-item col-6 col-md-auto">
              <Link href="#footer" className="btn btn-outline-secondary">
                <i className="bi bi-brush"></i> Change Theme
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};