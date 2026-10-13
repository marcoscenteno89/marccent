import Markdown from '@/components/server/markdown';
import { privacyPolicy } from '@/components/server/content';

export default function PrivacyPolicy() {
  return (
    <section className="wrap wrap-fluid">
      <div className="wrap bg border round pad grid cols-1 gap-3">
        {privacyPolicy.sections.map((section, i) => (
          <div key={i} className="pad border round grid cols-1 gap-3">
            {section.heading && <h2>{section.heading}</h2>}
            <Markdown text={section.body}/>
            {section.cards?.map(card => (
              <div key={card.title} className="bg border round grid gap-0 divide">
                <div className="header">{card.title}</div>
                <div className="body">
                  <p>{card.text}</p>
                </div>
              </div>
            ))}
            {section.after && <Markdown text={section.after}/>}
          </div>
        ))}
      </div>
    </section>
  )
}
