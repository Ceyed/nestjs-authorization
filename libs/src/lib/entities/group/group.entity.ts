import { uuid } from '@libs/constants/uuid.constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseEntity } from '../base.entity';
import { RoleEntity } from '../role/role.entity';
import { UserGroup } from '../user-group/user-group.entity';
import { AppModulesEnum, PermissionEnum } from '@prisma/client';

export class GroupEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  roleId: uuid;

  @ApiProperty({ type: 'enum', enum: AppModulesEnum })
  @IsEnum(AppModulesEnum)
  scope: AppModulesEnum;

  @ApiProperty({ type: 'enum', enum: PermissionEnum })
  @IsEnum(PermissionEnum)
  permissions: PermissionEnum[];

  @ApiProperty()
  role: RoleEntity;
  userGroups: UserGroup[];
}
