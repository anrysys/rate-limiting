import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { DataService } from './data.service';
import { CreateDataDto } from './dto/create-data.dto';
import { IDataResponse } from './interfaces/data-response.interface';

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

@Controller('api/data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post()
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
