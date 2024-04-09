import { uuid } from '@libs/constants/uuid.constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseEntity } from '../base.entity';
import { GroupEntity } from '../group/group.entity';
import { UserEntity } from '../user/user.entity';

export class UserGroup extends BaseEntity {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: uuid;

  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  @IsUUID()
  @IsString()
  groupId: uuid;

  @ApiProperty()
  group: GroupEntity;
}
