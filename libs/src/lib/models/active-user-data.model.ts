import { uuid } from '../constants';
import { RoleTypeEnum } from '../enums';

export interface UserAuthModel {
  sub: string;
  username: string;
  roleId: uuid;
  roleType: RoleTypeEnum;
}
