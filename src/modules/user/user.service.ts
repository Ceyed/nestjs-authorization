import { uuid } from '@libs/constants/uuid.constant';
import { GroupEntity } from '@libs/entities/group/group.entity';
import { UserEntity } from '@libs/entities/user/user.entity';
import { RoleTypeEnum } from '@libs/enums/role-type.enum';
import { UserAuthModel } from '@libs/models/active-user-data.model';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { PrismaService } from '@libs/modules/prisma';
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '@src/configs/jwt.config';
import { HashingService } from '../auth/hashing/hashing.service';
import {
  UpdateUserByAdminDto,
  UpdateUserDto,
} from './../../../libs/src/lib/dtos/user/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly _jwtConfig: ConfigType<typeof jwtConfig>,
  ) {}

  async getOneOrFail(id: uuid, withRoleRelation: boolean = false): Promise<UserEntity> {
    const user: UserEntity = await this._prismaService.user.findFirst({
      where: { id },
      ...(withRoleRelation && { include: { role: true } }),
    });
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
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResultModel> {
    return this._updateUserInfo(user.sub, updateUserDto);
  }

  async updateAnyUserWithLimitations(
    id: uuid,
    updateUserDto: UpdateUserDto,
    user: UserAuthModel,
  ): Promise<UpdateResultModel> {
    await this._userHasPermissionToUpdate(id, user);
    return this._updateUserInfo(id, updateUserDto);
  }

  async remove(id: uuid): Promise<UpdateResultModel> {
    try {
      await this.getOneOrFail(id);
      await this._prismaService.userGroup.deleteMany({ where: { userId: id } });
      const deleteResult: UserEntity = await this._prismaService.user.delete({ where: { id } });
      return { status: !!deleteResult };
    } catch (error) {
      return { status: false };
    }
  }

  private async _updatePasswordIfNeeded<T extends UpdateUserDto | UpdateUserByAdminDto>(
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

  private async _userHasPermissionToUpdate(id: uuid, user: UserAuthModel): Promise<void> {
    const targetUser: UserEntity = await this.getOneOrFail(id, true);
    const currentUser: UserEntity = await this.getOneOrFail(user.sub, true);

    if (currentUser.role.priority <= targetUser.role.priority) {
      if (
        currentUser.role.type === RoleTypeEnum.Employee &&
        currentUser.role.priority !== targetUser.role.priority
      ) {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  private async _updateUserInfo(
    id: uuid,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResultModel> {
    updateUserDto = await this._updatePasswordIfNeeded<UpdateUserDto>(updateUserDto);

    const updateResult: UserEntity = await this._prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
    return { status: !!updateResult };
  }
}
