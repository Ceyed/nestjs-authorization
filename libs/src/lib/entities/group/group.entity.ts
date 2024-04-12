import { uuid } from '@libs/constants/uuid.constant';
import { ApiProperty } from '@nestjs/swagger';
import { AppModulesEnum, PermissionEnum } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseEntity } from '../base.entity';
import { RoleEntity } from '../role/role.entity';
import { UserGroup } from '../user-group/user-group.entity';

export class GroupEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'enum', enum: AppModulesEnum, isArray: true })
  @IsEnum(AppModulesEnum, { each: true })
  @IsArray()
  scopes: AppModulesEnum[];

  @ApiProperty({ type: 'enum', enum: PermissionEnum, isArray: true })
  @IsEnum(PermissionEnum, { each: true })
  @IsArray()
  permissions: PermissionEnum[];

  @ApiProperty({ format: 'uuid', type: String })
  @IsUUID()
  @IsNotEmpty()
  roleId: uuid;

  @ApiProperty()
  role?: RoleEntity;

  @ApiProperty()
  userGroups?: UserGroup[];
}
