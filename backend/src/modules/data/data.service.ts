import { Injectable } from '@nestjs/common';
import { CreateDataDto } from './dto/create-data.dto';
import { IDataResponse } from './interfaces/data-response.interface';

@Injectable()
export class DataService {
  async create(createDataDto: CreateDataDto): Promise<IDataResponse> {
    try {
      // Here we simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      return {
        message: 'Data received successfully',
        receivedData: createDataDto.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Failed to process data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
