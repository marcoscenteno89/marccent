import 'server-only';
import { post } from '@marccent/util';

// The marccent backend, logged in with the site's own account. Server code only: use the tokens inside a route
// handler, server action or server component and return just the data a page needs; never send them to the browser
// (they work as a login until they expire). The backend address falls back to the public one when SERVERURL isn't set.
const server = process.env.SERVERURL ?? process.env.NEXT_PUBLIC_SERVER;

// { access, refresh } JWT pair (plus ok), fresh on every call.
export const getTokenPair = () => post(`${server}token/pair`, {
  username: process.env.MARCCENT_USERNAME,
  password: process.env.MARCCENT_PASSWORD,
}, {}, { cache: 'no-store' });
