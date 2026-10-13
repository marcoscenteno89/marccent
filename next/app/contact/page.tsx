import { Menu, contact } from "@/templates/menus";
import { ContactUsForm } from "@/components/client/component";
import MapWTCL from "@/components/client/map";
import Markdown from "@/components/server/markdown";
import { contactPage } from "@/components/server/content";

export default function Contact() {

  return (
    <section className="wrap wrap-fluid m-0 linear-gradient">
      <div className="wrap bg border round shadow-md overflow-hidden">
        <div className="grid cols-2 gap-0">
          <div>
            <MapWTCL className="h-100" zoom={10} />
          </div>
          <div className="pad">
            <h1>{contactPage.title}</h1>
            <Markdown text={contactPage.intro} />
            <ContactUsForm />
            <Menu items={contact} label="Contact links" iconOnly className="divide border round" />
          </div>
        </div>
      </div>
    </section>
  )
}
