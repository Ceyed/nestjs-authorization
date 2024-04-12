import { AppController } from '@libs/decorators/app-controller.decorator';
import { PostInfo } from '@libs/decorators/custom-post.decorator';
import { RefreshTokenDto } from '@libs/dtos/auth/refresh-token.dto';
import { AccessTokenAndRefreshTokenDto } from '@libs/dtos/common';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { Body } from '@nestjs/common';
import { AuthenticationService } from './auth.service';

@AppController(AppModulesEnum.Auth, 'auth', RouteTypeEnum.NORMAL)
export class AuthNormalController {
  constructor(private readonly _authenticationService: AuthenticationService) {}

  @PostInfo('refresh-token', RefreshTokenDto, false, {
    summary: 'refresh token',
    description: 'this route create new accessToken and refreshToken using old refreshToken',
    outputType: AccessTokenAndRefreshTokenDto,
  })
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto): Promise<AccessTokenAndRefreshTokenDto> {
    return this._authenticationService.refreshTokens(refreshTokenDto);
  }
}
