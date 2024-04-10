import { RoleGuardService } from '@libs/modules/role-guard';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  MODULE_CUSTOM_METADATA,
  REQUEST_USER_KEY,
  ROUTE_ACTION_METADATA,
  ROUTE_TYPE_METADATA,
} from '../constants';
import { AppModulesEnum, PermissionEnum, RouteTypeEnum } from '../enums';
import { UserAuthModel } from '../models';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _roleGuardService: RoleGuardService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routeType = this._reflector.get<RouteTypeEnum>(ROUTE_TYPE_METADATA, context.getClass());
    if (routeType === RouteTypeEnum.PUBLIC) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserAuthModel = request[REQUEST_USER_KEY];
    if (!user) return false;

    const actionType = this._reflector.get<PermissionEnum>(
      ROUTE_ACTION_METADATA,
      context.getHandler(),
    );
    const scopeOfClass = this._reflector.get<AppModulesEnum>(
      MODULE_CUSTOM_METADATA,
      context.getClass(),
    );

    const userGroups: Record<string, string[]>[] =
      await this._roleGuardService.getUserRoleGuards(user);
    const userHasNecessaryScope: Record<string, string[]> = userGroups.find((item) =>
      item.scopes.includes(scopeOfClass),
    );
    if (!userHasNecessaryScope) return false;
    return (
      userHasNecessaryScope.permissions.includes(PermissionEnum.All) ||
      userHasNecessaryScope.permissions.includes(actionType)
    );
  }
}
