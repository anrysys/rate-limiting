import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GetRepositoriesDto } from '../dto/get-repositories.dto';
import { GithubService } from '../services/github.service';
import { ValidationPipe } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('github')
@UseGuards(ThrottlerGuard)
@UseInterceptors(CacheInterceptor)
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('users/:username/repos')
  async getRepositories(
    @Param(ValidationPipe) params: GetRepositoriesDto,
  ) {
    return await this.githubService.getRepositories(params.username);
  }
}
