import Markdown from '@/components/server/markdown';
import { privacyPolicy } from '@/content';

export default function PrivacyPolicy() {
  return (
    <section className="wrap wrap-fluid">
      <div className="wrap bg border round pad">
        {privacyPolicy.sections.map((section, i) => (
          <div key={i} className="pad border round my-3">
            {section.heading && <h2>{section.heading}</h2>}
            <Markdown text={section.body} />
            {section.cards?.map(card => (
              <div key={card.title} className="card mb-3">
                <div className="card-header">{card.title}</div>
                <div className="card-body">
                  <p className="card-text">{card.text}</p>
                </div>
              </div>
            ))}
            {section.after && <Markdown text={section.after} />}
          </div>
        ))}
      </div>
    </section>
  )
}
