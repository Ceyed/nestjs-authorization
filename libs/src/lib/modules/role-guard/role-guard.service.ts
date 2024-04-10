import { uuid } from '@libs/constants/uuid.constant';
import { UserGroup } from '@libs/entities/user-group/user-group.entity';
import { UserEntity } from '@libs/entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { RedisHelperService } from '../redis-helper/redis-helper.service';

@Injectable()
export class RoleGuardService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _redisHelperService: RedisHelperService,
  ) {}

  async getUserRoleGuards(userId: uuid): Promise<Record<string, string[]>[]> {
    const user: UserEntity = await this._prismaService.user.findFirstOrThrow({
      where: { id: userId },
      include: { userGroups: { include: { group: true } } },
    });
    // const user = {
    //   id: '250cc215-9397-4af0-b0e8-f9341e07d0e9',
    //   createdAt: '2024-04-09T20:51:17.179Z',
    //   updatedAt: '2024-04-09T20:51:17.179Z',
    //   deletedAt: null,
    //   name: 'string',
    //   username: 'string',
    //   password: '$2b$10$w.RuiXPHNHBwLXOR36v0nu1BxL4Ca6JaynYlHjg1NXj5gTxlTzan.',
    //   roleId: 'b9f0565a-1460-4e13-ba21-9b16c11e0021',
    //   userGroups: [
    //     {
    //       userId: '250cc215-9397-4af0-b0e8-f9341e07d0e9',
    //       groupId: '357b2a71-40aa-41c9-ba67-e3b8b028deab',
    //       group: {
    //         id: '357b2a71-40aa-41c9-ba67-e3b8b028deab',
    //         createdAt: new Date('2024-04-09T19:46:39.756Z'),
    //         updatedAt: new Date('2024-04-09T19:46:39.756Z'),
    //         deletedAt: null,
    //         name: 'default Employee Group',
    //         scopes: [AppModulesEnum.Role, AppModulesEnum.User],
    //         permissions: [PermissionEnum.Create, PermissionEnum.Read, PermissionEnum.Update],
    //         roleId: 'b9f0565a-1460-4e13-ba21-9b16c11e0021',
    //       },
    //     },
    //   ],
    // };

    return this._serializeUserGroups(user.userGroups);
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
