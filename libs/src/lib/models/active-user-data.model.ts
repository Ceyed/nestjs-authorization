import { RoleTypeEnum } from '@prisma/client';
import { uuid } from '../constants';

export interface UserAuthModel {
  sub: string;
  username: string;
  roleId: uuid;
  roleType: RoleTypeEnum;
}
