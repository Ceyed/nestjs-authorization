import { RoleEntity } from '@libs/entities/role/role.entity';
import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { RoleTypeEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FilterRoleDto extends PartialType(
  PickType(RoleEntity, ['type', 'priority'] as const),
) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiPropertyOptional({ type: 'enum', enum: RoleTypeEnum })
  @IsOptional()
  @IsEnum(RoleTypeEnum)
  type?: RoleTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priority?: number;
}
