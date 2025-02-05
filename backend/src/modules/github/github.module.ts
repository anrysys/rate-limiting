import { Module } from '@nestjs/common';
import { GithubController } from './controllers/github.controller';
import { GithubService } from './services/github.service';

@Module({
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
