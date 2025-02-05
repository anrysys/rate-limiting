import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { Redis } from 'ioredis';

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(private readonly redis: Redis) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<{
    totalHits: number;
    timeToExpire: number;
    isBlocked: boolean;
    timeToBlockExpire: number;
  }> {
    try {
      const multi = this.redis.multi();
      
      multi.incr(key);
      multi.ttl(key);
      
      const results = await multi.exec();
      if (!results) {
        throw new Error('Failed to execute Redis commands');
      }

      const hits = results[0]?.[1] ? Number(results[0][1]) : 0;
      const ttlResult = results[1]?.[1] ? Number(results[1][1]) : -1;

      // Set TTL if not exists
      if (ttlResult === -1) {
        await this.redis.expire(key, Math.ceil(ttl / 1000));
      }

      // Check if blocked
      const isBlocked = hits > limit;
      const timeToBlockExpire = isBlocked ? blockDuration : 0;

      // If blocked, update expiration
      if (isBlocked) {
        await this.redis.expire(key, Math.ceil(blockDuration / 1000));
      }

      return {
        totalHits: hits,
        timeToExpire: ttlResult === -1 ? ttl : ttlResult * 1000,
        isBlocked,
        timeToBlockExpire,
      };
    } catch (error) {
      throw new Error(`Redis throttler error: ${error.message}`);
    }
  }
}
