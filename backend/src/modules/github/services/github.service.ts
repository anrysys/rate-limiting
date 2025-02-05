import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GithubRepository } from '../interfaces/github-repository.interface';

@Injectable()
export class GithubService {
  private readonly apiUrl: string;
  private readonly accessToken: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.apiUrl = this.configService.get<string>('github.apiUrl');
    this.accessToken = this.configService.get<string>('github.accessToken');
  }

  async getRepositories(username: string): Promise<GithubRepository[]> {
    try {
      // Try to get from cache first
      const cachedData = await this.cacheManager.get<GithubRepository[]>(
        `repos:${username}`,
      );
      if (cachedData) {
        return cachedData;
      }

      const response = await fetch(
        `${this.apiUrl}/users/${username}/repos?sort=updated`,
        {
          headers: {
            Authorization: `token ${this.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        if (response.status === 403) {
          throw new HttpException(
            'GitHub API rate limit exceeded',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        throw new HttpException(
          'GitHub API error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const repos = await response.json();
      const formattedRepos: GithubRepository[] = repos.map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        starCount: repo.stargazers_count,
        forkCount: repo.forks_count,
        primaryLanguage: repo.language,
      }));

      // Cache the results
      await this.cacheManager.set(`repos:${username}`, formattedRepos, 300); // Cache for 5 minutes

      return formattedRepos;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch repositories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
