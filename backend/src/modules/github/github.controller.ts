import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GithubService } from './github.service';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get(':username/repos')
  async getUserRepositories(
    @Param('username') username: string,
    @Query('page') page: string = '1',
    @Query('per_page') perPage: string = '10'
  ) {
    try {
      const repos = await this.githubService.getUserRepositories(username);
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
      return {
        success: false,
        data: {
          items: [],
          total: 0,
        },
        error: `Failed to fetch repositories: ${error.message}`,
      };
    }
  }
}
