import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'redis', // используем имя сервиса из docker-compose
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
}));
