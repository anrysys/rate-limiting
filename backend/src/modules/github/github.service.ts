import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly githubApiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.githubApiUrl = this.configService.get<string>('GITHUB_API_URL') || 'https://api.github.com';
    this.logger.log(`Initialized with GitHub API URL: ${this.githubApiUrl}`);
  }

  async getUserRepositories(username: string) {
    this.logger.debug(`Fetching repositories for user: ${username}`);

    try {
      const url = `${this.githubApiUrl}/users/${username}/repos`;
      this.logger.debug(`Making request to: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'rate-limiting-app',
        },
      });

      const rateLimit = {
        limit: response.headers.get('x-ratelimit-limit'),
        remaining: response.headers.get('x-ratelimit-remaining'),
        reset: response.headers.get('x-ratelimit-reset'),
      };

      this.logger.log('GitHub API Rate Limit:', rateLimit);

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`GitHub API error: ${response.status} - ${errorText}`);
        
        throw new HttpException(
          `GitHub API error: ${response.statusText || 'Failed to fetch data'}`,
          response.status,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.logger.error('Error fetching GitHub repositories:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to fetch GitHub repositories: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
