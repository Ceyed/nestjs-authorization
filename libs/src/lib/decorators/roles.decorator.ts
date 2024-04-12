import { SetMetadata } from '@nestjs/common';
import { RoleTypeEnum } from '../enums';

export const ROLES_KEY = 'roles';
export const Role = (...roles: RoleTypeEnum[]) => SetMetadata(ROLES_KEY, roles);
