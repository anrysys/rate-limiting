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
      useFactory: async (config: ConfigService): Promise<ThrottlerModuleOptions> => {
        const redis = new Redis({
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
        });

        const storage = new RedisThrottlerStorage(redis);
        const ttl: number = config.get('THROTTLE_TTL') ?? 60000; // Default 60 seconds
        const limit: number = config.get('THROTTLE_LIMIT') ?? 10; // Default 10 requests

        return {
          throttlers: [{ ttl, limit }],
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
