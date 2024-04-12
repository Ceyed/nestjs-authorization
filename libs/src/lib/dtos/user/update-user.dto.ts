import { UserEntity } from '@libs/entities/user/user.entity';
import { OmitType, PartialType, PickType } from '@nestjs/swagger';

export class UpdateUserByAdminDto extends PartialType(
  PickType(UserEntity, ['name', 'username', 'password', 'roleId'] as const),
) {}

export class UpdateUserDto extends OmitType(UpdateUserByAdminDto, ['roleId'] as const) {}
