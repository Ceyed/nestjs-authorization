import { GroupEntity } from '@libs/entities/group/group.entity';
import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterGroupDto extends PartialType(PickType(GroupEntity, ['isDefault'] as const)) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
