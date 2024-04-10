import { RoleTypeEnum } from '@prisma/client';

export interface UserAuthModel {
  sub: string;
  username: string;
  roleType: RoleTypeEnum;
}
