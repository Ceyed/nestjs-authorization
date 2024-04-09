import { uuid } from '@libs/constants/uuid.constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseEntity } from '../base.entity';
import { RoleEntity } from '../role/role.entity';
import { UserGroup } from '../user-group/user-group.entity';

export class UserEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  roleId: uuid;

  @ApiProperty()
  role: RoleEntity;

  @ApiProperty()
  userGroups: UserGroup[];
}
