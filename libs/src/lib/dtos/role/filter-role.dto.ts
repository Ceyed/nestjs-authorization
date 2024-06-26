import { RoleEntity } from '@libs/entities/role/role.entity';
import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterRoleDto extends PartialType(
  PickType(RoleEntity, ['type', 'priority'] as const),
) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
