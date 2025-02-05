import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('users')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get(':username/repos')
  async getUserRepositories(@Param('username') username: string) {
    try {
      const repos = await this.githubService.getUserRepositories(username);
      return {
        success: true,
        data: repos,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: `Failed to fetch repositories: ${error.message}`,
      };
    }
  }
}
