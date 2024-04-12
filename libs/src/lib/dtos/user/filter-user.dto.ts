import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
