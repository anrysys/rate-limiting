import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  imports: [ConfigModule],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
