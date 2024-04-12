import { uuid } from '@libs/constants/uuid.constant';
import { GroupEntity } from '@libs/entities/group/group.entity';
import { UserEntity } from '@libs/entities/user/user.entity';
import { UserAuthModel } from '@libs/models/active-user-data.model';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { PrismaService } from '@libs/modules/prisma';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '@src/configs/jwt.config';
import { HashingService } from '../auth/hashing/hashing.service';
import {
  UpdateCurrentUserDto,
  UpdateUserByAdminDto,
} from './../../../libs/src/lib/dtos/user/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly _jwtConfig: ConfigType<typeof jwtConfig>,
  ) {}

  async getOneOrFail(id: uuid): Promise<UserEntity> {
    const user: UserEntity = await this._prismaService.user.findFirst({ where: { id } });
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  getProfile(user: UserAuthModel): Promise<UserEntity> {
    return this._prismaService.user.findFirstOrThrow({ where: { id: user.sub } });
  }

  async updateByAdmin(
    id: uuid,
    updateUserByAdminDto: UpdateUserByAdminDto,
  ): Promise<UpdateResultModel> {
    await this._updateUserByAdminValidation(id, updateUserByAdminDto);

    updateUserByAdminDto =
      await this._updatePasswordIfNeeded<UpdateUserByAdminDto>(updateUserByAdminDto);

    if (updateUserByAdminDto?.roleId) {
      await this._deleteAllPreviousGroups(id);
      await this._assignDefaultGroupsToUser(id, updateUserByAdminDto?.roleId);
    }

    const updateResult: UserEntity = await this._prismaService.user.update({
      where: { id },
      data: updateUserByAdminDto,
    });
    return { status: !!updateResult };
  }

  async updateCurrentUser(
    user: UserAuthModel,
    updateCurrentUserDto: UpdateCurrentUserDto,
  ): Promise<UpdateResultModel> {
    updateCurrentUserDto =
      await this._updatePasswordIfNeeded<UpdateCurrentUserDto>(updateCurrentUserDto);

    const updateResult: UserEntity = await this._prismaService.user.update({
      where: { id: user.sub },
      data: updateCurrentUserDto,
    });
    return { status: !!updateResult };
  }

  remove(id: uuid): Promise<UpdateResultModel> {
    // todo
    return Promise.resolve({ status: false });
  }

  private async _updatePasswordIfNeeded<T extends UpdateCurrentUserDto | UpdateUserByAdminDto>(
    data: T,
  ): Promise<T> {
    if (data?.password) {
      data.password = await this._hashingService.hash(data.password + this._jwtConfig.pepper);
    }
    return data;
  }

  private async _updateUserByAdminValidation(
    id: uuid,
    updateUserByAdminDto: UpdateUserByAdminDto,
  ): Promise<void> {
    await this.getOneOrFail(id);
    if (updateUserByAdminDto?.roleId) {
      const role: number = await this._prismaService.role.count({
        where: { id: updateUserByAdminDto.roleId },
      });
      if (!role) {
        throw new NotFoundException('Role not founded!');
      }
    }
  }

  private async _deleteAllPreviousGroups(id: uuid): Promise<void> {
    await this._prismaService.userGroup.deleteMany({ where: { userId: id } });
  }

  private async _assignDefaultGroupsToUser(id: uuid, roleId: uuid): Promise<void> {
    const newDefaultGroup: GroupEntity = await this._prismaService.group.findFirst({
      where: { roleId },
    });
    if (!newDefaultGroup)
      throw new NotFoundException('There is no active group for this role. create one first!');

    await this._prismaService.userGroup.create({
      data: {
        userId: id,
        groupId: newDefaultGroup.id,
      },
    });
  }
}
