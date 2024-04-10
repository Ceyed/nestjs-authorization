import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleTypeEnum } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { BaseEntity } from '../base.entity';
import { GroupEntity } from '../group/group.entity';
import { UserEntity } from '../user/user.entity';

export class RoleEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  luckyNumber: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  priority: number;

  @ApiProperty({ type: 'enum', enum: RoleTypeEnum })
  @IsEnum(RoleTypeEnum, { each: true })
  type: RoleTypeEnum;

  @ApiPropertyOptional()
  @IsArray()
  users?: UserEntity[];

  @ApiProperty()
  @IsArray()
  groups?: GroupEntity[];
}
