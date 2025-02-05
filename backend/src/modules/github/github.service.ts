import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  constructor(private readonly configService: ConfigService) {}

  async getUserRepos(username: string) {
    try {
      const githubApiUrl = this.configService.get<string>('GITHUB_API_URL');
      const response = await fetch(`${githubApiUrl}/users/${username}/repos`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NestJS-App',
        },
      });

      if (!response.ok) {
        throw new HttpException(
          `GitHub API responded with status: ${response.status}`,
          response.status,
        );
      }

      const repos = await response.json();
      return repos.map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
      }));
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch GitHub repositories',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
