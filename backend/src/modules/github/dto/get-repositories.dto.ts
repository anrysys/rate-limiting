import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class GetRepositoriesDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'Username can only contain alphanumeric characters and hyphens',
  })
  username: string;
}
