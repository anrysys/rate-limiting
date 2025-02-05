import { Injectable, Logger, OnModuleInit, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

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
  }

  async onModuleInit() {
    this.logger.log(`Initialized with API URL: ${this.baseUrl}`);
    if (!this.token) {
      this.logger.warn('No GitHub token provided - rate limits will be restricted');
    }
  }

  async getRepositories(username: string): Promise<any[]> {
    try {
      // Try to get from cache first
      const cacheKey = `github_repos_${username}`;
      const cached = await this.cacheManager.get<any[]>(cacheKey);
      if (cached) {
        return cached;
      }

      // Make API request if not in cache
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseUrl}/users/${username}/repos`, {
        headers,
      });

      if (!response.ok) {
        throw new BadRequestException(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Cache the results
      await this.cacheManager.set(cacheKey, data, 60 * 1000); // Cache for 1 minute

      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch repositories for ${username}:`, error);
      throw new BadRequestException(
        `Failed to fetch GitHub repositories: ${error.message}`,
      );
    }
  }
}
