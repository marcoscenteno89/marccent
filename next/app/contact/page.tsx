'use client'; // the form keeps its result in state and sends from the browser
import { useState } from 'react';
import { post } from '@marccent/util';
import { Menu, contact } from "@/components/layout/menus";
import MapWTCL from "@/components/apps/map";
import { Form } from '@/components/ui/form';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { contactPage } from "@/lib/content";

type Result = { tone: 'success' | 'danger', msg: string };

export default function Contact() {
  const [ result, setResult ] = useState<Result | null>(null); // after a send

  // Name, email and message, posted to the server's message/ endpoint. The browser validates the fields first; the
  // result shows in an Alert under the form, which clears after a successful send. post resolves to the JSON body
  // with ok added, or to the Error itself when the request fails.
  const send = async (values: Record<string, FormDataEntryValue>, form: HTMLFormElement) => {
    const res = await post(`${process.env.NEXT_PUBLIC_SERVER}message/`, values);
    if (res?.ok) {
      setResult({ tone: 'success', msg: typeof res.response === 'string' ? res.response : 'Thanks! Your message was sent.' });
      form.reset();
    } else {
      setResult({ tone: 'danger', msg: "Your message couldn't be sent. Please try again later." });
    }
  };

  return (
    <section className="wrap wrap-fluid bg-gradient vh-100 col-center">
      <div className="wrap bg border round shadow pad-0">
        <div className="grid cols-2 gap-0 layout-2-1">
          <div>
            <MapWTCL className="h-100" zoom={10}/>
          </div>
          <div className="grid cols-1 pad-x pad-y-lg gap-sm">
            <h1>{contactPage.title}</h1>
            {/* Plain text, so no <Markdown>: that renders on the server (marked) and this page runs in the browser. */}
            <p>{contactPage.intro.trim()}</p>
            <div className="grid cols-1 gap-sm">
              <Form onSubmit={send} submitLabel={false}>
                <Field name="first_name" autoComplete="given-name" required />
                <Field name="last_name" autoComplete="family-name" required />
                <Field name="email" type="email" autoComplete="email" required />
                <Field name="message" as="textarea" rows={4} required />
                {/* Our own submit button (submitLabel={false} drops the built-in one): full width. The form still blocks a
                    second send while one is running; this button just doesn't show the spinner. */}
                <Button type="submit" icon="paper-plane" className="primary w-100">Send</Button>
              </Form>
              {result && <Alert tone={result.tone}>{result.msg}</Alert>}
            </div>
            <Menu items={contact} label="Contact links" iconOnly layout="auto-cols cols-center" className="divide border round"/>
          </div>
        </div>
      </div>
    </section>
  )
}
