import { uuid } from '@libs/constants/uuid.constant';
import { OrderDto, PaginationDto } from '@libs/dtos/common';
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '@libs/dtos/role';
import { RoleEntity } from '@libs/entities/role/role.entity';
import { RedisPrefixesEnum } from '@libs/enums/redis-prefixes.enum';
import { RedisSubPrefixesEnum } from '@libs/enums/redis-sub-prefixes.enum';
import { UserAuthModel } from '@libs/models/active-user-data.model';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { PrismaService } from '@libs/modules/prisma';
import { RedisHelperService } from '@libs/modules/redis-helper';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleTypeEnum } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _redisHelperService: RedisHelperService,
  ) {}

  async getAllWithPagination(
    pagination: PaginationDto,
    order: OrderDto,
    filters: FilterRoleDto,
  ): Promise<[RoleEntity[], number]> {
    const redisKey: string = this._getRedisKey(
      JSON.stringify(pagination) + JSON.stringify(order) + JSON.stringify(filters),
    );
    return this._redisHelperService.getFromCacheOrDb<[RoleEntity[], number]>(redisKey, async () => {
      let orderBy = {};
      if (order?.order) {
        orderBy = { [order.order]: order.orderBy };
      } else {
        orderBy = { createdAt: 'desc' };
      }

      const results: RoleEntity[] = await this._prismaService.role.findMany({
        skip: pagination?.skip ?? 0,
        take: pagination?.size ?? 10,
        where: {
          ...(filters?.priority && { priority: +filters.priority }),
          ...(filters?.type && { type: filters.type }),
          ...(filters?.searchTerm && { name: { contains: filters.searchTerm } }),
        },
        orderBy,
      });
      const total: number = await this._prismaService.role.count();
      return [results, total];
    });
  }

  async getOneOrFail(id: uuid): Promise<RoleEntity> {
    const role: RoleEntity = await this._prismaService.role.findFirst({ where: { id } });
    if (!role) throw new NotFoundException('Role not found!');
    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    await this._validateRolePriority(createRoleDto.priority);
    this._removeRoleFromRedis();
    return this._prismaService.role.create({ data: createRoleDto });
  }

  async update(
    id: uuid,
    updateRoleDto: UpdateRoleDto,
    user: UserAuthModel,
  ): Promise<UpdateResultModel> {
    await this._updateRoleValidation(id, user, updateRoleDto?.priority);

    const updateResult: RoleEntity = await this._prismaService.role.update({
      where: { id },
      data: updateRoleDto,
    });

    this._removeRoleFromRedis();
    return { status: !!updateResult };
  }

  async delete(id: uuid): Promise<UpdateResultModel> {
    await this.getOneOrFail(id);
    try {
      const deleteResult: RoleEntity = await this._prismaService.role.delete({ where: { id } });
      this._removeRoleFromRedis();
      return { status: !!deleteResult };
    } catch (error) {
      throw new ConflictException('Role is being used');
    }
  }

  private async _validateRolePriority(priority: number): Promise<void> {
    const priorityExists: number = await this._prismaService.role.count({
      where: { priority },
    });
    if (!!priorityExists) {
      throw new ConflictException('The priority is used before. Choose another order');
    }
  }

  private async _updateRoleValidation(
    id: uuid,
    user: UserAuthModel,
    priority?: number,
  ): Promise<void> {
    if (priority) await this._validateRolePriority(priority);
    const role: RoleEntity = await this.getOneOrFail(id);
    const userRole: RoleEntity = await this.getOneOrFail(user.roleId);

    if (userRole.priority <= role.priority) {
      if (user.roleType === RoleTypeEnum.Employee && userRole.priority !== role.priority) {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  private _getRedisKey(paginationAndOrder: string): string {
    return this._redisHelperService.getStandardKey(
      RedisPrefixesEnum.Role,
      RedisSubPrefixesEnum.All,
      paginationAndOrder,
    );
  }

  private _removeRoleFromRedis(): void {
    const pattern: string = this._redisHelperService.getPatternKey(
      RedisPrefixesEnum.Role,
      RedisSubPrefixesEnum.All,
    );
    this._redisHelperService.deleteByPattern(pattern);
  }
}
