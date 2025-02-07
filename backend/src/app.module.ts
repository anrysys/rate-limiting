import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { Redis } from 'ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisThrottlerStorage } from './common/storages/redis-throttler.storage';
import configuration from './config/configuration';
import { GithubModule } from './modules/github/github.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): ThrottlerModuleOptions => {
        const redis = new Redis({
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
        });

        const storage = new RedisThrottlerStorage(redis);
        const ttl = config.get<number>('THROTTLE_TTL') ?? 60; // 60 seconds
        const limit = config.get<number>('THROTTLE_LIMIT') ?? 10; // 10 requests

        return {
          throttlers: [
            {
              ttl: ttl * 1000, // Convert to milliseconds
              limit: limit,
            },
          ],
          storage,
        };
      },
    }),
    GithubModule,
    // ...existing code...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
