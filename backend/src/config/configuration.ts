export default () => ({
  port: parseInt(process.env.PORT ?? '5111', 10),

  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD ?? undefined,
    ttl: parseInt(process.env.REDIS_CACHE_TTL ?? '60', 10),
  },

  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '10', 10),
  },

  github: {
    apiUrl: process.env.GITHUB_API_URL ?? 'https://api.github.com',
    token: process.env.GITHUB_TOKEN ?? undefined,
  },
});
