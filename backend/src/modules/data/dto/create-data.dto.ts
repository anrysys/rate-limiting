import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDataDto {
  @IsString()
  @IsNotEmpty()
  data: string;
}
