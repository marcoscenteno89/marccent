// All site copy lives here. Pages import their part and render it.
// Prose is Markdown (rendered with <Markdown>, components/markdown.js); indentation is stripped,
// so keep template literals indented. Lists that get their own styling are plain arrays.
// Only our own text goes here: Markdown output is not sanitized.

// Site-wide facts: the metadata (layout.tsx), structured data (lib/schema.js), sitemap, robots, llms.txt and the
// social image all read these, so search engines and AI answer engines get one consistent story.
export const site = {
  title: 'Marccent',
  url: 'https://marccent.com',
  tagline: 'A grid-first CSS theme, and the live site that demos it',
  description: 'Marccent is a grid-first CSS theme built by Marcos Centeno, a full-stack web developer in Idaho Falls, Idaho. This site is its live demo: every page, card, form, chart and animation is built from the theme.',
  keywords: [
    'Marccent', 'Marcos Centeno', 'CSS theme', 'CSS grid layout', 'design system', 'dark mode', 'glassmorphism',
    'CSS shapes', 'parallax', 'canvas animations', 'React', 'Next.js', 'full-stack web developer', 'Idaho Falls',
  ],
  locale: 'en_US',
  author: {
    name: 'Marcos Centeno',
    jobTitle: 'Full-stack web developer',
    email: 'marcoscenteno89@gmail.com',
    city: 'Idaho Falls',
    region: 'ID',
    country: 'US',
    image: '/marcos-cartoon.svg',
  },
  updated: '2026-10-22', // shown as "last updated" and used in the sitemap and structured data
  footer: (year) => `Copyright ©${year} Marccent. All rights reserved | [Privacy Policy](/privacy-policy)`,
  footerBlurb: `
    **This site is the demo.** Marccent is a CSS theme, and every page here (the apps, the landing pages, this footer)
    is built from it. Pick colors below and watch the whole site follow.
  `,
  footerExplore: 'Explore',
  footerConnect: 'Connect',
};

// Numbers shown on the home page and in the FAQ. Keep them in step with the code: themes = styles/themes/*.css,
// shapes = .shape-* in utilities.css, animations = canvas.js backgrounds, scenery = scenery-paths.js layers.
export const theme = {
  name: 'Marccent',
  stats: [
    { value: 27, label: 'design styles', icon: 'swatchbook' },
    { value: 39, label: 'CSS shapes', icon: 'shapes' },
    { value: 11, label: 'canvas animations', icon: 'wand-magic-sparkles' },
    { value: 29, label: 'parallax layers', icon: 'mountain-sun' },
    { value: 6, label: 'demo landing pages', icon: 'window-maximize' },
  ],
};

export const home = {
  meta: {
    title: 'Marccent: a grid-first CSS theme by Marcos Centeno',
    description: 'Meet Marccent, a grid-first CSS theme with 27 design styles, light, dark and glass modes, CSS shapes, parallax and canvas animations. This whole site is its live demo.',
  },
  hero: {
    kicker: 'Live demo site · Marccent theme',
    title: 'The theme is the product. This site is the demo.',
    intro: `
      Hi, I'm **Marcos Centeno**, a full-stack web developer in Idaho Falls, Idaho. I'm building **Marccent**: a
      grid-first CSS theme. Every page you see here (the cards, forms, charts and the mountains behind this text) is
      made from it.
    `,
    primary: { label: 'Explore the theme', href: '/theme', icon: 'palette' },
    secondary: { label: 'About me', href: '/about', icon: 'user' },
  },
  what: {
    kicker: 'The product',
    title: 'What is Marccent?',
    // The direct answer first: answer engines quote the opening sentences.
    answer: `
      **Marccent is a CSS theme built around CSS Grid.** It gives a site its layout, colors, type, buttons, forms,
      shapes and motion from a small set of plain classes, so pages are built from markup instead of one-off CSS. It
      started as my way off Bootstrap; now it runs this whole site with no CSS framework underneath.
    `,
    features: [
      { icon: 'table-cells', title: 'Grid first', text: 'Columns, subgrids, stacks and auto-fitting cards from a handful of classes like grid, cols-3, stack and pairs.' },
      { icon: 'swatchbook', title: '27 design styles', text: 'Glassmorphism, brutalism, editorial, terminal, claymorphism and more: pick one in the footer or the header tools and the whole site changes its look.' },
      { icon: 'circle-half-stroke', title: 'Light, dark and glass', text: 'Every color is derived from four: primary, secondary, dark and light. Modes and palettes re-theme every page at once.' },
      { icon: 'hexagon-nodes', title: 'Shapes and scenery', text: 'Hexagons, tickets, ribbons and 36 more shapes, plus silhouette layers that stack into landscapes.' },
      { icon: 'leaf', title: 'Motion that rests', text: 'Canvas animations and timers run only while on screen and stand still for visitors who ask for reduced motion.' },
      { icon: 'code', title: 'Light on JavaScript', text: 'Widgets are plain JS classes behind thin React wrappers, so the logic is not tied to one framework.' },
    ],
  },
  live: {
    kicker: 'Try it now',
    title: 'Re-theme the whole site from here',
    text: `
      Pick a design style, dark mode, glass or a color card and every section on this page follows, because none of
      it has colors of its own. To theme just one section, use the mini editor under it.
    `,
    card: { label: 'Live canvas', title: 'Drawn in your theme colors', text: 'Change the colors and the blobs follow.' },
  },
  // The mini theme editors (components/theme/mini-editor.js): each changes only the section right above it.
  mini: {
    title: 'Theme the section above',
    text: 'A design style, the mode, glass and a color card, for this one section: the rest of the site stays as it is.',
  },
  band: {
    title: 'Every color on this site comes from two you pick.',
    text: 'Even the animations: this one is drawn in your theme colors, and runs only while you can see it.',
  },
  showcase: {
    kicker: 'The demo',
    title: 'See every part of the theme',
    text: 'Each Design page shows one part of the theme, live, in the colors and mode you pick.',
    // tile: Collage tile props (widgets/collage.js); the page adds the button from href.
    tiles: [
      { href: '/theme', src: 'blue1', size: 'feature', overlay: 'tint', label: 'Theme', title: 'Colors, type, buttons, forms', text: 'Every building block in the active theme, hover effects included.', icon: 'palette' },
      { href: '/animations', canvas: 'network-loop', size: 'square', overlay: 'glass', label: 'Animations', title: 'Canvas in your colors', icon: 'wand-magic-sparkles' },
      { href: '/shapes', src: 'pink3', size: 'square', overlay: 'focus', label: 'Shapes', title: '39 CSS shapes', icon: 'shapes' },
      { href: '/parallax', src: 'teal3', size: 'landscape', overlay: 'blur', label: 'Parallax', title: 'Landscapes that scroll in layers', icon: 'mountain-sun' },
      { href: '/widgets', src: 'orange4', size: 'landscape', overlay: 'glass', label: 'Widgets', title: 'Calendars, gauges, timelines and more', icon: 'puzzle-piece' },
      { href: '/images', src: 'purple1', size: 'landscape', overlay: 'blur', label: 'Images', title: 'Every photo card overlay', icon: 'images' },
    ],
  },
  landing: {
    kicker: 'Real-world pages',
    title: 'Six made-up companies, one theme',
    text: 'Each landing page sets its own palette and font and nothing else: the layout, cards and widgets all come from Marccent.',
    pages: [
      { name: 'Pulsegrid', href: '/landing/pulsegrid', icon: 'wave-square', kind: 'Product analytics' },
      { name: 'Ridgeline', href: '/landing/ridgeline', icon: 'mountain', kind: 'Guided treks' },
      { name: 'Brightside Dental', href: '/landing/brightside', icon: 'tooth', kind: 'Family dentistry' },
      { name: 'Fernbank', href: '/landing/fernbank', icon: 'seedling', kind: 'Online banking' },
      { name: 'Signal Summit', href: '/landing/signal-summit', icon: 'tower-broadcast', kind: 'Developer conference' },
      { name: 'Starfall Mesa', href: '/landing/starfall', icon: 'moon', kind: 'Dark-sky lodge' },
    ],
  },
  now: {
    kicker: 'Right now',
    title: 'What I am working on',
    text: `
      Marccent has been growing one step at a time since 2020, and this site has moved with it. Here is where it has
      been, and where it is going.
    `,
    // Dates from the repository history.
    events: [
      { date: 'Apr 2020', icon: 'flag', title: 'Marccent begins', text: 'A React front end with its own back end, and a theme switcher from the start.' },
      { date: 'Jun 2020', icon: 'cubes', title: 'The theme becomes a class', text: 'Themes rewritten from functions into one object, the idea the site still runs on.' },
      { date: 'Jan 2021', icon: 'bomb', title: 'Minesweeper', text: 'The first game, and the first app built on the theme.' },
      { date: 'Mar 2021', icon: 'layer-group', title: 'Bootstrap added', text: 'Bootstrap 4 brought in for the layout grid and components.' },
      { date: 'Apr 2021', icon: 'droplet', title: 'Glass mode', text: 'Frosted glass added beside light and dark.' },
      { date: 'Nov 2021', icon: 'server', title: 'A back end in Docker', text: 'Contact messages and theme options stored by the server, now in containers.' },
      { date: 'Apr 2023', icon: 'puzzle-piece', title: 'Numpuz and shared widgets', text: 'A sliding puzzle, and pieces like the counter pulled out to stand on their own.' },
      { date: 'Dec 2023', icon: 'code', title: 'From React to JS classes', text: 'Canvas, colors, forms and limits moved into @marccent/util: plain JavaScript classes any project can import.' },
      { date: 'May 2024', icon: 'arrow-right-arrow-left', title: 'Moved to Next.js', text: 'The site rebuilt on Next.js, with server rendering.' },
      { date: 'Oct 2026', icon: 'table-cells', title: 'Bootstrap out, grid in', text: 'After five years, a CSS Grid layout system replaced Bootstrap; colors cut down to a primary and secondary palette.' },
      { date: 'Oct 2026', icon: 'swatchbook', title: 'Design styles and pages', text: '27 optional looks, shapes, widgets, parallax scenery, canvas animations and the Marccent logo.' },
      { date: 'Now', icon: 'gears', title: 'Less React', text: 'Still moving widget logic into plain JavaScript classes, with thin React wrappers.' },
      { date: 'Next', icon: 'box-open', title: 'A theme for other projects', text: 'Packaging Marccent so it can style sites beyond this one.' },
    ],
  },
  apps: {
    kicker: 'Built with it',
    title: 'Apps and games',
    text: 'Small apps that put the theme to work: games, live weather and stock charts.',
  },
  faqTitle: 'Questions about Marccent',
  cta: {
    title: 'Have a project, or a question about the theme?',
    text: 'I am always happy to talk about web work, collaborations or what Marccent can do.',
    button: { label: 'Get in touch', href: '/about#contact', icon: 'paper-plane' },
  },
};

// Questions and answers, shown on the home page and sent as FAQPage structured data. Answers are plain text (no
// Markdown): answer engines read them as they are.
export const faq = [
  { q: 'What is Marccent?', a: 'Marccent is a grid-first CSS theme by Marcos Centeno. It provides layout, colors, typography, buttons, forms, CSS shapes, parallax scenery and canvas animations through plain CSS classes and small components.' },
  { q: 'Is this website a demo of the theme?', a: 'Yes. marccent.com is the live demo site for the Marccent theme. Every page, including the apps, the design pages and the six landing pages for made-up companies, is built from the theme.' },
  { q: 'Who built Marccent?', a: 'Marcos Centeno, a full-stack web developer in Idaho Falls, Idaho, who has built websites and web applications since 2016.' },
  { q: 'Does Marccent use Bootstrap or Tailwind?', a: 'No. Marccent started as a replacement for Bootstrap and now runs without any CSS framework. Layout comes from its own CSS Grid classes.' },
  { q: 'How do I change the colors or the mode?', a: 'Use the switches in the header for dark mode and glass, and the theme cards in the footer for colors. Every color in the theme is derived from a primary, a secondary, a dark and a light color, so the whole site follows.' },
  { q: 'What are design styles?', a: 'Design styles are 27 optional looks for the theme, such as glassmorphism, brutalism, editorial and terminal. Each one is a single CSS file that restyles the whole site without changing its markup, and visitors can switch between them live in the footer.' },
  { q: 'Can I change the theme of one section only?', a: 'Yes. Switch the theme controls in the header from Site to Section, click a section, then use the mode, glass and color controls: only that section changes. Reset puts it back to the site theme.' },
  { q: 'Do the animations slow the page down?', a: 'They are built not to. Canvas animations and timers run only while they are on screen, decorative canvases draw at a lower resolution, and everything stands still for visitors who ask for reduced motion.' },
];

export const appsPage = {
  title: 'Marccent App List',
};

// The About page, which is also the contact page (/contact redirects to its #contact section).
export const about = {
  meta: {
    title: 'About Marcos Centeno and contact',
    description: 'Marcos Centeno is a full-stack web developer in Idaho Falls, Idaho, building the Marccent CSS theme. Read about his work and send him a message.',
  },
  greeting: 'Hello, I am',
  title: 'Marcos Centeno',
  role: 'Full-stack web developer · Idaho Falls, Idaho',
  intro: `
    I design, build and troubleshoot responsive interfaces and web applications, and have done so since 2016. I work
    in vanilla JavaScript, CSS, Python and PHP, with React, Next.js, Django and WordPress. Lately most of my evenings go
    into **Marccent**, the CSS theme this site is built on.
  `,
  photo: { src: '/marcos-cartoon.svg', alt: 'Cartoon portrait of Marcos Centeno' }, // drawn from public/mcr.webp
  facts: [
    { icon: 'location-dot', text: 'Idaho Falls, Idaho' },
    { icon: 'briefcase', text: 'Web developer since 2016' },
    { icon: 'palette', text: 'Building the Marccent theme' },
  ],
  focus: {
    kicker: 'Right now',
    title: 'What I am trying to accomplish',
    items: [
      { icon: 'table-cells', title: 'A theme anyone can build with', text: 'Marccent should make a good-looking, accessible page out of plain markup, with no framework and no one-off CSS.' },
      { icon: 'flask', title: 'Proof in public', text: 'This site is the test: if the apps, the landing pages and the design pages all hold up in every style and mode, the theme works.' },
      { icon: 'code', title: 'Less framework, more web', text: 'I am moving logic into plain JavaScript classes and leaning on what CSS can do today: grid, subgrid, container queries, cascade layers.' },
    ],
  },
  experienceTitle: 'Experience',
  experienceHeading: 'Where I build for the web',
  jobs: [
    {
      date: 'Feb 2016 – present',
      icon: 'briefcase',
      title: 'Web Developer, Anthem Broadband',
      text: 'Idaho Falls, ID. Front end, WordPress and Django, from page animations to build tooling and servers.',
    },
  ],
  dutiesTitle: 'What the job involves',
  skillsTitle: 'Skills',
  skills: [
    'Javascript', 'CSS', 'HTML 5', 'React', 'Bootstrap', 'PHP', 'Wordpress', 'Python', 'Django', 'Linux',
    'GIT', 'Docker', 'MYSQL', 'Hubspot', 'Data Analysis', 'Problem Solving', 'Adaptability',
    'Ability to conduct research', 'Willingness to Learn',
  ],
  job: {
    duties: [
      'Writing reusable, modular JavaScript code following best practices.',
      'Consuming RESTful APIs and working with JSON using async/await and promises.',
      'Implemented custom smooth scrolling, parallax, and DOM manipulation effects with vanilla JS.',
      'Implemented responsive design and optimized web pages for maximum speed and scalability.',
      'Configured and optimized Webpack build process for production deployments.',
      'Implemented complex page animations and effects.',
      'Built and customized WordPress themes.',
      'Developed custom WordPress plugins to add specialized functionality.',
      'Developed new features and applications using Django framework.',
      'Implemented class-based views, custom model fields, querysets.',
      'Work with graphic designers to implement animations and effects that aligned with brand style guide.',
      'Git version control and pull request workflows.',
      'Experience with Linux administration and bash scripting.',
      'Knowledge of Docker containerization and Docker Compose.',
      'Familiarity with Nginx web server configuration.',
    ],
  },
  mini: {
    title: 'Theme the section above',
    text: 'Only that section changes. The header and footer controls theme the whole site.',
  },
  band: {
    title: 'Based in Idaho Falls, Idaho',
    text: 'Open to new projects, job opportunities and collaborations.',
  },
  contact: {
    kicker: 'Contact',
    title: 'Get in touch',
    intro: "I'm always glad to talk about new projects, job opportunities, collaborations or the Marccent theme. Send a message, or reach me on any of the links below.",
    mapCaption: 'Idaho Falls, Idaho',
  },
};

// App descriptions, keyed by the slug in the app's url (/apps/<slug>). components/apps/list.tsx reads these.
export const apps = {
  minesweeper: {
    name: 'Minesweeper',
    about: `
      Clear the grid without hitting a mine. Each number tells you how many mines touch that square: use them to find and flag the mines. Right-click to plant a flag where you suspect one, and reveal every safe square to win. One wrong click ends the game.
    `,
    instructions: `
      Click "Play" to begin the game.

      Use the left click button on the mouse to select a space on the grid. If you hit a bomb, you lose.

      The numbers on the board represent how many bombs are adjacent to a square. For example, if a square has a "3" on it, then there are 3 bombs next to that square. The bombs could be above, below, right left, or diagonal to the square.

      Avoid all the bombs and expose all the empty spaces to win Minesweeper.

      - **Tip:** Use the numbers to determine where you know a bomb is.
      - **Tip:** You can right click a square with the mouse to place a flag where you think a bomb is. This allows you to avoid that spot.
    `,
  },
  numpuz: {
    name: 'Number Puzzle',
    about: `
      The classic 15-puzzle: slide the tiles into the empty space until they read 1 to 15 in order. Click a tile next to the gap, or drag it in. A timer tracks your speed and a percentage shows how close you are to solving it.
    `,
    instructions: `
      Numpuz is a type of number riddle puzzle that typically involves arranging a set of numbers or symbols in a particular pattern or sequence. Here are some general rules for playing a Numpuz puzzle:

      - **Objective:** The goal of Numpuz is to fill in the missing numbers or symbols in a sequence or pattern, using logical and mathematical reasoning.
      - **Setup:** A Numpuz puzzle typically consists of a grid of squares or cells, with some squares already filled in with numbers or symbols. The player's task is to fill in the remaining squares to complete the pattern or sequence.
      - **Gameplay:** Each Numpuz puzzle has its own unique rules and patterns, but generally, players use logic and deduction to determine the missing numbers or symbols. Some common techniques include looking for patterns or relationships between adjacent numbers, using basic mathematical operations to derive missing values, and applying deductive reasoning to narrow down the possible values for each square.
      - **Scoring:** Numpuz puzzles are typically not scored, as they are a form of puzzle rather than a competitive game.
      - **Winning and Losing:** There is no "winning" or "losing" in Numpuz, as it is a puzzle that can be solved or completed by finding the correct values for all squares.

      Overall, the rules of Numpuz are relatively simple, but the puzzles themselves can be challenging and require careful observation and logical thinking to solve.
    `,
  },
  weather: {
    name: 'Weather App',
    about: `
      Search any city to see its current weather on a map and the forecast in 3-hour steps: temperature, humidity and more. Page through the coming days one day at a time, with the map and colors following your site theme.
    `,
    instructions: `
      Type a city name in the search box and submit to load its forecast.
    `,
  },
  stock_lookup: {
    name: 'Stock Lookup',
    about: `
      Charts the last 100 daily closing values of the most popular stock market indexes, using data from [FRED](https://fred.stlouisfed.org/) (Federal Reserve Bank of St. Louis). Pick an index from the list or search any FRED series, then hover over the chart to read the exact value for each day.
    `,
    instructions: `
      Pick an index from the list, or type its FRED series ID (for example \`SP500\`) in the search box and submit. Hover over the chart to read values.
    `,
  },
};

// Privacy policy: one box per section. cards (optional) render as a card each, after the body.
export const privacyPolicy = {
  meta: {
    title: 'Privacy Policy',
    description: 'How Marccent (marccent.com) collects, uses and protects visitor information, and your rights under the CCPA and GDPR.',
  },
  title: 'Privacy Policy',
  sections: [
    {
      body: `
        At Marccent, accessible from marccent.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Marccent and how we use it.

        If you have additional questions or require more information about our Privacy Policy, do not hesitate to [contact us](/about#contact).

        This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Marccent. This policy is not applicable to any information collected offline or via channels other than this website. Our Privacy Policy was created with the help of the [Free Privacy Policy Generator](https://www.privacypolicygenerator.info/#wizard).
      `,
    },
    {
      heading: 'Consent',
      body: `
        By using our website, you hereby consent to our Privacy Policy and agree to its terms.
      `,
    },
    {
      heading: 'Information we collect',
      body: `
        The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.

        If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.

        When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
      `,
    },
    {
      heading: 'How we use your information',
      body: `
        We use the information we collect in various ways, including to:

        - Provide, operate, and maintain our website
        - Improve, personalize, and expand our website
        - Understand and analyze how you use our website
        - Develop new products, services, features, and functionality
        - Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes
        - Send you emails
        - Find and prevent fraud
      `,
    },
    {
      heading: 'Log Files',
      body: `
        Marccent follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
      `,
    },
    {
      heading: 'Cookies and Web Beacons',
      body: `
        Like any other website, Marccent uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.

        For more general information on cookies, please read ["What Are Cookies" from Cookie Consent](https://www.privacypolicyonline.com/what-are-cookies/).
      `,
    },
    {
      heading: 'Advertising Partners Privacy Policies',
      body: `
        You may consult this list to find the Privacy Policy for each of the advertising partners of Marccent.

        Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Marccent, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.

        Note that Marccent has no access to or control over these cookies that are used by third-party advertisers.
      `,
    },
    {
      heading: 'Third Party Privacy Policies',
      body: `
        Marccent's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.

        You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
      `,
    },
    {
      heading: 'CCPA Privacy Rights (Do Not Sell My Personal Information)',
      body: `
        Under the CCPA, among other rights, California consumers have the right to:

        Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.

        Request that a business delete any personal data about the consumer that a business has collected.

        Request that a business that sells a consumer's personal data, not sell the consumer's personal data.

        If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
      `,
    },
    {
      heading: 'GDPR Data Protection Rights',
      body: `
        We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
      `,
      cards: [
        { title: 'The right to access', text: 'You have the right to request copies of your personal data. We may charge you a small fee for this service.' },
        { title: 'The right to rectification', text: 'You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.' },
        { title: 'The right to erasure', text: 'You have the right to request that we erase your personal data, under certain conditions.' },
        { title: 'The right to restrict processing', text: 'You have the right to request that we restrict the processing of your personal data, under certain conditions.' },
        { title: 'The right to object to processing', text: 'You have the right to object to our processing of your personal data, under certain conditions.' },
        { title: 'The right to data portability', text: 'You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.' },
      ],
      after: `
        If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
      `,
    },
    {
      heading: "Children's Information",
      body: `
        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.

        Marccent does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
      `,
    },
  ],
};
