module.exports = {
    //...
    settings: {
      cors: {
        origin: [
            'http://localhost:1337', 
            'http://localhost:3000', 
            'https://marccent.com', 
            'https://www.marccent.com'
        ],
        headers: ["Content-Type", "Authorization", "X-Frame-Options", "sentry-trace"]
      },
    },
  };