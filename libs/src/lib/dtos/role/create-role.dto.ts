import { RoleEntity } from '@libs/entities/role/role.entity';
import { PickType } from '@nestjs/swagger';

export class CreateRoleDto extends PickType(RoleEntity, [
  'name',
  'luckyNumber',
  'priority',
  'type',
] as const) {}
