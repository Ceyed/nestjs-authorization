import { GroupEntity } from '@libs/entities/group/group.entity';
import { PickType } from '@nestjs/swagger';

export class CreateGroupDto extends PickType(GroupEntity, [
  'name',
  'permissions',
  'scopes',
  'roleId',
] as const) {}
