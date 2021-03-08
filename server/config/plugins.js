module.exports = ({ env }) => ({
    sentry: {
      dsn: env('SENTRY_DNS')
    }
});