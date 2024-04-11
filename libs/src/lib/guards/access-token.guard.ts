import { RoleGuardService } from '@libs/modules/role-guard';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConfig } from 'src/app/config/jwt.config';
import { REQUEST_USER_KEY } from '../constants';
import { UserAuthModel } from '../models';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly _jwtConfig: ConfigType<typeof jwtConfig>,
    private readonly _roleGuardService: RoleGuardService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this._extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: UserAuthModel = await this._jwtService.verifyAsync(token, this._jwtConfig);
      await this._roleGuardService.getUserOrFail(payload.sub);
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new UnauthorizedException();
    }
    return true;
  }

  private _extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
