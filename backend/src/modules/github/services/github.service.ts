import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly githubApiUrl: string;
  private readonly cacheTTL = 3600; // 1 hour

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.githubApiUrl =
      this.configService.get<string>('GITHUB_API_URL') ||
      'https://api.github.com';
    this.logger.log(`Initialized with GitHub API URL: ${this.githubApiUrl}`);
  }

  async getUserRepositories(username: string) {
    try {
      // Try to get from cache first
      const cacheKey = `github:repos:${username}`;
      const cachedData = await this.cacheManager.get(cacheKey);

      if (cachedData) {
        this.logger.debug(`Cache hit for ${username}'s repositories`);
        return cachedData;
      }

      this.logger.debug(`Cache miss for ${username}'s repositories`);
      const url = `${this.githubApiUrl}/users/${username}/repos`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'rate-limiting-app',
        },
      });

      // Log rate limit information
      const rateLimit = {
        limit: response.headers.get('x-ratelimit-limit'),
        remaining: response.headers.get('x-ratelimit-remaining'),
        reset: response.headers.get('x-ratelimit-reset'),
      };
      this.logger.log('GitHub API Rate Limit:', rateLimit);

      if (!response.ok) {
        throw new HttpException(
          `GitHub API error: ${response.statusText}`,
          response.status,
        );
      }

      const data = await response.json();

      // Cache the successful response
      await this.cacheManager.set(cacheKey, data, this.cacheTTL);

      return data;
    } catch (error) {
      this.logger.error('Error fetching GitHub repositories:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Failed to fetch GitHub repositories: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
