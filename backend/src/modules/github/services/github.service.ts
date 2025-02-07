import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { GithubRepository } from '../interfaces/github-repository.interface';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly githubApiUrl: string;
  private readonly githubToken: string | undefined; // Changed type to allow undefined
  private readonly cacheTTL = 300; // 5 minutes

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.githubApiUrl =
      this.configService.get<string>('GITHUB_API_URL') ||
      'https://api.github.com';
    this.githubToken = this.configService.get<string>('GITHUB_TOKEN');

    if (!this.githubToken) {
      this.logger.warn(
        'GITHUB_TOKEN not provided - API rate limits will be restricted',
      );
    }

    this.logger.log('GitHub Service initialized:', {
      apiUrl: this.githubApiUrl,
      hasToken: !!this.githubToken,
    });
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'rate-limiting-app',
    };

    if (this.githubToken) {
      headers['Authorization'] = `Bearer ${this.githubToken}`; // Changed to Bearer token
    }

    return headers;
  }

  private logCacheStatus(
    type: 'hit' | 'miss',
    username: string,
    data?: GithubRepository[],
  ) {
    const status = {
      type,
      username,
      timestamp: new Date().toISOString(),
      nextReset: this.cacheTTL
        ? new Date(Date.now() + this.cacheTTL * 1000).toISOString()
        : null,
      itemsCount: data?.length ?? 0,
    };
    this.logger.debug('Cache status:', status);
  }

  async getUserRepositories(username: string): Promise<GithubRepository[]> {
    try {
      // Включаем параметры пагинации в ключ кэша
      const cacheKey = `github:repos:${username}`;

      const cached = await this.cacheManager.get<GithubRepository[]>(cacheKey);
      if (cached) {
        this.logCacheStatus('hit', username, cached);
        return cached;
      }

      // Проверяем существование пользователя и получаем репозитории за один запрос
      const repos = await this.fetchUserRepositories(username);

      // Кэшируем полный результат
      await this.cacheManager.set(cacheKey, repos, this.cacheTTL);
      this.logCacheStatus('miss', username, repos);

      return repos;
    } catch (error) {
      this.logger.error(`Error processing request for ${username}:`, error);
      throw error;
    }
  }

  private async fetchUserRepositories(
    username: string,
  ): Promise<GithubRepository[]> {
    const userReposUrl = `${this.githubApiUrl}/users/${username}/repos?per_page=100`;
    const response = await fetch(userReposUrl, { headers: this.getHeaders() });

    if (!response.ok) {
      if (response.status === 404) {
        throw new HttpException(
          `GitHub user '${username}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        `GitHub API error: ${response.statusText}`,
        response.status,
      );
    }

    this.logRateLimits(response.headers);
    return response.json() as Promise<GithubRepository[]>;
  }

  private logRateLimits(headers: Headers) {
    const rateLimit = {
      limit: headers.get('x-ratelimit-limit'),
      remaining: headers.get('x-ratelimit-remaining'),
      reset: new Date(
        parseInt(headers.get('x-ratelimit-reset') || '0') * 1000,
      ).toISOString(),
    };
    this.logger.log('GitHub API Rate Limits:', rateLimit);
  }
}
