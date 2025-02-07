import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GithubRepository } from '../interfaces/github-repository.interface';
import { GithubService } from '../services/github.service';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get(':username/repos')
  async getUserRepositories(
    @Param('username') username: string,
    @Query('page') page: string = '1',
    @Query('per_page') perPage: string = '10',
  ): Promise<{
    success: boolean;
    data: {
      items: GithubRepository[];
      total: number;
    };
    error: string | null;
  }> {
    try {
      const repos: GithubRepository[] =
        await this.githubService.getUserRepositories(username);
      const pageNum = parseInt(page);
      const itemsPerPage = parseInt(perPage);
      const start = (pageNum - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      return {
        success: true,
        data: {
          items: repos.slice(start, end),
          total: repos.length,
        },
        error: null,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message.includes('Not Found')
            ? `GitHub user '${username}' not found`
            : error.message
          : 'Unknown error occurred';

      return {
        success: false,
        data: {
          items: [],
          total: 0,
        },
        error: errorMessage,
      };
    }
  }
}
