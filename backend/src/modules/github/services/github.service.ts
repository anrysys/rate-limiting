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
      const cacheKey = `github:repos:${username}`;

      // Try cache first
      const cached = await this.cacheManager.get<GithubRepository[]>(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for ${username}`, {
          cacheKey,
          itemsCount: cached.length,
          username,
        });
        this.logCacheStatus('hit', username, cached);
        return cached;
      }

      this.logCacheStatus('miss', username);

      // Check if user exists
      const userResponse = await fetch(
        `${this.githubApiUrl}/users/${username}`,
        { headers: this.getHeaders() },
      );

      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          this.logger.warn(`User ${username} not found`);
          throw new HttpException(
            `GitHub user '${username}' not found`,
            HttpStatus.NOT_FOUND,
          );
        }
        throw new HttpException(
          `GitHub API error: ${userResponse.statusText}`,
          userResponse.status,
        );
      }

      // Fetch repositories
      this.logger.debug(`Cache miss for ${username}, fetching from GitHub API`);
      const reposResponse = await fetch(
        `${this.githubApiUrl}/users/${username}/repos`,
        { headers: this.getHeaders() },
      );

      // Log rate limits
      const rateLimit = {
        limit: reposResponse.headers.get('x-ratelimit-limit'),
        remaining: reposResponse.headers.get('x-ratelimit-remaining'),
        reset: new Date(
          parseInt(reposResponse.headers.get('x-ratelimit-reset') || '0') *
            1000,
        ).toISOString(),
        username,
        hasToken: !!this.githubToken,
      };
      this.logger.log('GitHub API Rate Limits:', rateLimit);

      if (!reposResponse.ok) {
        throw new HttpException(
          `Failed to fetch repositories: ${reposResponse.statusText}`,
          reposResponse.status,
        );
      }

      const repos = (await reposResponse.json()) as GithubRepository[];

      // Cache successful response
      await this.cacheManager.set(cacheKey, repos, this.cacheTTL);
      this.logger.debug(`Cached ${repos.length} repositories for ${username}`);

      return repos;
    } catch (error) {
      this.logger.error(`Error processing request for ${username}:`, error);
      throw error;
    }
  }
}
