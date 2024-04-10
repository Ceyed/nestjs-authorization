import { uuid } from '@libs/constants/uuid.constant';
import { UserGroup } from '@libs/entities/user-group/user-group.entity';
import { UserEntity } from '@libs/entities/user/user.entity';
import { RedisPrefixesEnum } from '@libs/enums/redis-prefixes.enum';
import { RedisSubPrefixesEnum } from '@libs/enums/redis-sub-prefixes.enum';
import { UserAuthModel } from '@libs/models/active-user-data.model';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { RedisHelperService } from '../redis-helper/redis-helper.service';

@Injectable()
export class RoleGuardService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _redisHelperService: RedisHelperService,
  ) {}

  async getUserRoleGuards(userAuth: UserAuthModel): Promise<Record<string, string[]>[]> {
    const redisKey: string = this._getRedisKey(userAuth.sub);
    const user: UserEntity = await this._redisHelperService.getFromCacheOrDb<UserEntity>(
      redisKey,
      async () =>
        this._prismaService.user.findFirstOrThrow({
          where: { id: userAuth.sub },
          include: { userGroups: { include: { group: true } } },
        }),
      300,
    );
    return this._serializeUserGroups(user.userGroups);
  }

  private _getRedisKey(userId: uuid): string {
    return this._redisHelperService.getStandardKey(
      RedisPrefixesEnum.Auth,
      RedisSubPrefixesEnum.User,
      userId,
    );
  }

  private _serializeUserGroups(userGroups: Partial<UserGroup>[]): Record<string, string[]>[] {
    return userGroups.reduce((acc, item) => {
      acc.push({
        scopes: item.group.scopes,
        permissions: item.group.permissions,
      });
      return acc;
    }, []);
  }
}
