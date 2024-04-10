import { uuid } from '@libs/constants/uuid.constant';
import { UserEntity } from '@libs/entities/user/user.entity';
import { UserAuthModel } from '@libs/models/active-user-data.model';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { PrismaService } from '@libs/modules/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly _prismaService: PrismaService) {}

  getUserProfile(user: UserAuthModel): Promise<UserEntity> {
    return this._prismaService.user.findFirstOrThrow({ where: { id: user.sub } });
  }

  removeUser(id: uuid): Promise<UpdateResultModel> {
    return Promise.resolve({ status: false });
  }
}
