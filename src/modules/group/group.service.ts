import { uuid } from '@libs/constants/uuid.constant';
import { CreateGroupDto } from '@libs/dtos/group';
import { GroupEntity } from '@libs/entities/group/group.entity';
import { UserEntity } from '@libs/entities/user/user.entity';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { PrismaService } from '@libs/modules/prisma';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GroupService {
  constructor(private readonly _prismaService: PrismaService) {}

  async getOneOrFail(id: uuid): Promise<GroupEntity> {
    const group: GroupEntity = await this._prismaService.group.findFirst({ where: { id } });
    if (!group) throw new NotFoundException('Group not founded!');
    return group;
  }

  create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {
    return this._prismaService.group.create({ data: createGroupDto });
  }

  async assignToUser(id: uuid, userId: uuid): Promise<UpdateResultModel> {
    await this._assignGroupToUserValidation(id, userId);
    // const assignResult = await this._prismaService.userGroup.update({
    //   //   where: { userId },
    //   where: { userId_groupId: { userId, groupId: id } },
    //   data: { groupId: id, userId },
    // });
    const assignResult = await this._prismaService.userGroup.create({
      data: { userId, groupId: id },
    });
    return { status: !!assignResult };
  }

  private async _assignGroupToUserValidation(
    id: uuid,
    userId: uuid,
  ): Promise<[GroupEntity, UserEntity]> {
    const group: GroupEntity = await this.getOneOrFail(id);
    const user: UserEntity = await this._prismaService.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not founded!');
    }
    if (user.roleId !== group.roleId) {
      throw new ConflictException('The group is not compatible to the user');
    }
    return [group, user];
  }
}
