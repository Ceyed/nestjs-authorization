import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const contextRoles = this._reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // if (!contextRoles) {
    //   return true;
    // }

    // const activeUser: UserAuthModel = context.switchToHttp().getRequest()[REQUEST_USER_KEy];
    // return contextRoles.some((role) => activeUser.role === role);
    return true;
  }
}
