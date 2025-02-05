import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GithubService } from './github.service';

@Controller('users')
@UseGuards(ThrottlerGuard)
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
