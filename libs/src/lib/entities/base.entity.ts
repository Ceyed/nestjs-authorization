import { uuid } from '@libs/constants/uuid.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class BaseEntity {
  @ApiProperty({ format: 'uuid', type: 'string' })
  @IsNotEmpty()
  @IsUUID()
  @Expose()
  id: uuid;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;
}
