import { Controller, Get, Headers, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppService } from './app.service';

@ApiTags('Rate Limiting Tests')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Test endpoint without rate limiting' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/ip-limit')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Test IP-based rate limiting' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  testIpLimit(@Headers('x-forwarded-for') ip: string) {
    return {
      message: 'IP-based rate limit test',
      ip: ip || 'local',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test/user-limit')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Test user-based rate limiting' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  testUserLimit(@Request() req) {
    return {
      message: 'User-based rate limit test',
      userId: req.headers['user-id'] || 'anonymous',
      timestamp: new Date().toISOString(),
    };
  }
}
