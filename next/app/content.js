// All site copy lives here. Pages import their part and render it.
// Prose is Markdown (rendered with <Markdown>, components/server/markdown.js); indentation is stripped,
// so keep template literals indented. Lists that get their own styling are plain arrays.
// Only our own text goes here: Markdown output is not sanitized.

export const site = {
  title: 'Marccent',
  description: 'Marcos Centeno Portfolio Website',
  footer: (year) => `Copyright ©${year} Marccent. All rights reserved | [Privacy Policy](/privacy-policy)`,
};

export const home = {
  greeting: 'Hello',
  title: 'I am Marcos Centeno',
  intro: `
    A full-stack web developer based in Idaho Falls, ID. With 6+ years of expertise designing, developing,
    and troubleshooting responsive user interfaces and web applications. Skilled
    in Vanilla Javascript, CSS, Python, PHP, and frameworks like React, Django,
    WordPress and Bootstrap.
  `,
  appsTitle: 'Marccent App List',
};

export const appsPage = {
  title: 'Marccent App List',
};

export const about = {
  greeting: 'Hello',
  title: 'I am Marcos Centeno',
  intro: `
    A full-stack web developer with 6+ years of expertise designing, developing,
    and troubleshooting responsive user interfaces and web applications. Skilled
    in Vanilla Javascript, CSS, Python, PHP, and frameworks like React, Django,
    WordPress and Bootstrap.
  `,
  photo: { src: '/mcr.webp', alt: "Marcos Centeno's Picture" },
  skillsTitle: 'Skills',
  skills: [
    'Javascript', 'CSS', 'HTML 5', 'React', 'Bootstrap', 'PHP', 'Wordpress', 'Python', 'Django', 'Linux',
    'GIT', 'Docker', 'MYSQL', 'Hubspot', 'Data Analysis', 'Problem Solving', 'Adaptability',
    'Ability to conduct research', 'Willingness to Learn',
  ],
  job: {
    header: `
      **Anthem Broadband**, Idaho Falls, ID — Web Developer

      Feb 2016 - PRESENT
    `,
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
  techTitle: 'Technologies used in this website',
  tech: [
    'fa-brands fa-js', 'fa-brands fa-react', 'fa-brands fa-css3', 'fa-brands fa-bootstrap',
    'fa-brands fa-cloudflare', 'fa-solid fa-font-awesome', 'fa-brands fa-python', 'fa-brands fa-hotjar',
    'fa-brands fa-docker', 'fa-brands fa-ubuntu',
  ],
};

export const contactPage = {
  title: 'Get in Touch',
  intro: `
    I'm always excited to discuss new projects, job opportunities, and other potential collaborations. Whether you have a question about my services, want to explore working together, or just want to connect - don't hesitate to reach out!
  `,
};

// App descriptions, keyed by the slug in the app's url (/apps/<slug>). apps/list.tsx reads these.
export const apps = {
  minesweeper: {
    name: 'Minesweeper',
    about: `
      Minesweeper is a single-player logic-based computer game played on a grid of squares. The objective is to clear the grid without detonating any hidden "mines" scattered throughout. Safe squares display numbers indicating the total number of adjacent mines. Players use these clues to strategically identify and flag the mines, progressing through the game by making calculated decisions based on the revealed information. The game offers different difficulty levels and is known for its challenging and strategic gameplay.
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
      A number puzzle is an educational activity that helps children learn and practice various math concepts such as number sequencing, counting, and recognizing numerals. These puzzles often involve matching numbers, counting dots, or arranging number pieces in the correct order. They are designed to enhance problem-solving and cognitive skills while making learning math more engaging for children. Number puzzles can cover a range of numbers, from 0 to 20, 1 to 100, or other specific number ranges.
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
      This weather app is a digital application that provides users with up-to-date weather information for their specific location or other selected locations. It typically offers details such as the current temperature, rain forecast, humidity, wind speed, air quality index, and sunrise/sunset times. Some weather apps also include features like hourly and 10-day forecasts, and maps to visualize weather patterns. These app is designed to help users plan their activities and make informed decisions based on the latest weather conditions.
    `,
    instructions: `
      Type a city name in the search box and submit to load its forecast.
    `,
  },
  stock_lookup: {
    name: 'Stock Lookup',
    about: `
      Charts the last 100 daily closing values of the most popular stock market indexes, using data from [FRED](https://fred.stlouisfed.org/) (Federal Reserve Bank of St. Louis).
    `,
    instructions: `
      Pick an index from the list, or type its FRED series ID (for example \`SP500\`) in the search box and submit. Hover over the chart to read values.
    `,
  },
};

// Privacy policy: one box per section. cards (optional) render as a card each, after the body.
export const privacyPolicy = {
  sections: [
    {
      body: `
        At Marccent, accessible from marccent.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Marccent and how we use it.

        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.

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

        - Provide, operate, and maintain our webste
        - Improve, personalize, and expand our webste
        - Understand and analyze how you use our webste
        - Develop new products, services, features, and functionality
        - Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the webste, and for marketing and promotional purposes
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
