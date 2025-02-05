import { Injectable } from '@nestjs/common';
import { CreateDataDto } from './dto/create-data.dto';

@Injectable()
export class DataService {
  create(createDataDto: CreateDataDto) {
    // Here you can add your business logic
    // For now, we'll just echo back the data
    return {
      message: 'Data received successfully',
      receivedData: createDataDto.data,
      timestamp: new Date().toISOString(),
    };
  }
}
