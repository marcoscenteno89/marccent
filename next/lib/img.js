// Photos live in the img R2 bucket (served at img.marccent.com), not in the repo. img('blue1') → its URL.
export const IMG = process.env.NEXT_PUBLIC_IMG ?? 'https://img.marccent.com/marccent';
export const img = (name) => `${IMG}/${name}.webp`;
