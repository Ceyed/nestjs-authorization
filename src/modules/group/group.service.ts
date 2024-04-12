import { uuid } from '@libs/constants/uuid.constant';
import { OrderDto, PaginationDto } from '@libs/dtos/common';
import { CreateGroupDto, FilterGroupDto } from '@libs/dtos/group';
import { GroupEntity } from '@libs/entities/group/group.entity';
import { UserEntity } from '@libs/entities/user/user.entity';
import { RedisPrefixesEnum } from '@libs/enums/redis-prefixes.enum';
import { RedisSubPrefixesEnum } from '@libs/enums/redis-sub-prefixes.enum';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { PrismaService } from '@libs/modules/prisma';
import { RedisHelperService } from '@libs/modules/redis-helper';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateGroupDto } from './../../../libs/src/lib/dtos/group/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _redisHelperService: RedisHelperService,
  ) {}

  async getAllWithPagination(
    pagination: PaginationDto,
    order: OrderDto,
    filters: FilterGroupDto,
  ): Promise<[GroupEntity[], number]> {
    const redisKey: string = this._getRedisKey(
      JSON.stringify(pagination) + JSON.stringify(order) + JSON.stringify(filters),
    );
    return this._redisHelperService.getFromCacheOrDb<[GroupEntity[], number]>(
      redisKey,
      async () => {
        let orderBy = {};
        if (order?.order) {
          orderBy = { [order.order]: order.orderBy };
        } else {
          orderBy = { createdAt: 'desc' };
        }

        const where = {
          ...(filters?.searchTerm && { name: { contains: filters.searchTerm } }),
          ...(filters?.isDefault && { isDefault: '' + filters.isDefault === 'true' }),
        };

        const results: GroupEntity[] = await this._prismaService.group.findMany({
          skip: pagination?.skip ?? 0,
          take: pagination?.size ?? 10,
          where,
          orderBy,
        });
        const total: number = await this._prismaService.group.count({ where });
        return [results, total];
      },
    );
  }

  async getOneOrFail(id: uuid): Promise<GroupEntity> {
    const group: GroupEntity = await this._prismaService.group.findFirst({ where: { id } });
    if (!group) throw new NotFoundException('Group not founded!');
    return group;
  }

  create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {
    this._removeGroupFromRedis();
    return this._prismaService.group.create({ data: createGroupDto });
  }

  async assignToUser(id: uuid, userId: uuid): Promise<UpdateResultModel> {
    await this._assignGroupToUserValidation(id, userId);
    const assignResult = await this._prismaService.userGroup.create({
      data: { userId, groupId: id },
    });
    return { status: !!assignResult };
  }

  async update(id: uuid, updateGroupDto: UpdateGroupDto): Promise<UpdateResultModel> {
    await this.getOneOrFail(id);
    const updateResult: GroupEntity = await this._prismaService.group.update({
      where: { id },
      data: updateGroupDto,
    });
    this._removeGroupFromRedis();
    return { status: !!updateResult };
  }

  async setDefaultGroup(id: uuid): Promise<UpdateResultModel> {
    await this.getOneOrFail(id);
    await this._prismaService.group.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });
    const updateResult: GroupEntity = await this._prismaService.group.update({
      where: { id },
      data: { isDefault: true },
    });
    this._removeGroupFromRedis();
    return { status: !!updateResult };
  }

  async delete(id: uuid): Promise<UpdateResultModel> {
    await this._deleteValidation(id);
    try {
      const deleteResult: GroupEntity = await this._prismaService.group.delete({ where: { id } });
      this._removeGroupFromRedis();
      return { status: !!deleteResult };
    } catch (error) {
      throw new ConflictException('group is being used');
    }
  }

  private async _deleteValidation(id: uuid): Promise<void> {
    const group: GroupEntity = await this.getOneOrFail(id);
    if (group.isDefault) {
      throw new BadRequestException('You can not delete default group');
    }
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

  private _getRedisKey(params: string): string {
    return this._redisHelperService.getStandardKey(
      RedisPrefixesEnum.Group,
      RedisSubPrefixesEnum.All,
      params,
    );
  }

  private _removeGroupFromRedis(): void {
    const pattern: string = this._redisHelperService.getPatternKey(
      RedisPrefixesEnum.Group,
      RedisSubPrefixesEnum.All,
    );
    this._redisHelperService.deleteByPattern(pattern);
  }
}
