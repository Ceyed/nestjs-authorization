import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { BaseEntity } from '../base.entity';
import { GroupEntity } from '../group/group.entity';
import { UserEntity } from '../user/user.entity';

export class RoleEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  luckyNumber: number;

  @ApiProperty()
  users: UserEntity[];

  @ApiProperty()
  groups: GroupEntity[];
}
