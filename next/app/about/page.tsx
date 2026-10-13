import Markdown from '@/components/server/markdown';
import { about } from '@/components/server/content';

// Grid only: no borders or radius; lines between parts come from .divide (globals.css).
// Parts sit flush (gap-0) and carry their own .pad, so each line falls midway between them.
export default function About() {
  return (
    <section className="wrap wrap-fluid">
      <div className="wrap bg grid cols-1 gap-0 divide">

        <div className="grid layout-1-3 gap-3 items-center pad">
          <img src={about.photo.src} className="img-fluid" alt={about.photo.alt} />
          <div className="grid cols-1 gap-2">
            <h4>{about.greeting}</h4>
            <h1>{about.title}</h1>
            <Markdown text={about.intro} />
          </div>
        </div>

        <div className="grid layout-1-2 gap-0 divide">
          <div className="grid cols-1 gap-2 content-start pad">
            <h4>{about.skillsTitle}</h4>
            <ul className="grid cols-1 gap-0 divide" style={{ '--pad': '.5rem' } as React.CSSProperties}>
              {about.skills.map(skill => <li key={skill} className="pad">{skill}</li>)}
            </ul>
          </div>
          <div className="grid cols-1 gap-0 content-start divide pad">
            <div className="pad">
              <Markdown text={about.job.header} />
            </div>
            <ul className="grid cols-1 gap-0 divide" style={{ '--pad': '.5rem' } as React.CSSProperties}>
              {about.job.duties.map(duty => <li key={duty} className="pad">{duty}</li>)}
            </ul>
          </div>
        </div>

        <div className="grid cols-1 gap-0 divide text-center pad">
          <h2 className="pad">{about.techTitle}</h2>
          <div className="grid fixed cols-5 pad">
            {about.tech.map(icon => <div key={icon} className="h1"><i className={icon}></i></div>)}
          </div>
        </div>

      </div>
    </section>
  )
}
