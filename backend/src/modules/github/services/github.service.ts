import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { GithubRepository } from '../interfaces/github-repository.interface';

@Injectable()
export class GithubService implements OnModuleInit {
  private readonly logger = new Logger(GithubService.name);
  private readonly baseUrl: string;
  private readonly token: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const baseUrl = this.configService.get<string>('github.apiUrl');
    if (!baseUrl) {
      throw new Error('GitHub API URL is required but not configured');
    }
    this.baseUrl = baseUrl;
    this.token = this.configService.get<string>('github.token');

    if (!this.token) {
      this.logger.warn(
        'GitHub token is not configured - API access will be limited',
      );
    }
  }

  onModuleInit() {
    this.logger.log(`Initialized with API URL: ${this.baseUrl}`);
  }
  async getRepositories(username: string): Promise<GithubRepository[]> {
    try {
      // Check cache first
      const cached = await this.cacheManager.get<GithubRepository[]>(cacheKey);
      const cached = await this.cacheManager.get<any[]>(cacheKey);
      if (cached) {
        this.logger.log(`Cache hit for ${username}'s repositories`);
        return cached;
      }

      // API request configuration
      const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
      };

      if (this.token) {
        headers['Authorization'] = `token ${this.token}`;
      }

      // Make API request
      const response = await fetch(`${this.baseUrl}/users/${username}/repos`, {
        headers,
      });

      if (response.status === 401) {
        throw new UnauthorizedException(
          'Invalid GitHub token or unauthorized access',
        );
      }

      if (!response.ok) {
        throw new BadRequestException(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }
      const data = (await response.json()) as GithubRepository[];
      const data = await response.json();

      // Cache successful response
      await this.cacheManager.set(cacheKey, data, 60 * 1000); // 1 minute cache
      this.logger.log(`Cached ${username}'s repositories`);

      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch repositories for ${username}:`, error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch GitHub repositories: ${error.message}`,
      );
    }
  }
}
