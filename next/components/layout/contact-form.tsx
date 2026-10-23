'use client'; // the form keeps its result in state and sends from the browser
import { useState } from 'react';
import { post } from '@marccent/util';
import { Form } from 'marccent-theme/components/ui/form';
import { Field } from 'marccent-theme/components/ui/field';
import { Button } from 'marccent-theme/components/ui/button';
import { Alert } from 'marccent-theme/components/ui/alert';

type Result = { tone: 'success' | 'danger', msg: string };

// The contact form (the About page's #contact section): name, email and message, posted to the server's message/
// endpoint. The browser validates the fields first; the result shows in an Alert under the form, which clears after a
// successful send. post resolves to the JSON body with ok added, or to the Error itself when the request fails.
export default function ContactForm() {
  const [ result, setResult ] = useState<Result | null>(null); // after a send

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
  );
}
