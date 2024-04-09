import { RoleTypeEnum } from '@libs/enums/user-type.enum';
import { uuid } from '../constants';

export interface UserAuthModel {
  sub: string;
  username: string;
  role: RoleTypeEnum;
  userGroupIds: uuid[];
}
