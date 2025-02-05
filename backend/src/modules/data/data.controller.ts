import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { DataService } from './data.service';
import { CreateDataDto } from './dto/create-data.dto';
import { IDataResponse } from './interfaces/data-response.interface';

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

@Controller('data')  // Changed from 'api/data' to just 'data'
@UseGuards(ThrottlerGuard)
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  async create(
    @Body() createDataDto: CreateDataDto
  ): Promise<ApiResponse<IDataResponse>> {
    try {
      const result = await this.dataService.create(createDataDto);
      return {
        success: true,
        data: result,
        error: null,
      };
    } catch (error) {
      if (error.name === 'ThrottlerException') {
        throw new HttpException(
          {
            success: false,
            data: null,
            error: 'Rate limit exceeded. Please try again later.',
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      throw new HttpException(
        {
          success: false,
          data: null,
          error: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
