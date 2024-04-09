import { AppController } from '@libs/decorators/app-controller.decorator';
import { SignInDto, SignUpDto } from '@libs/dtos/auth';
import { AccessTokenAndRefreshTokenDto } from '@libs/dtos/common';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './auth.service';

@AppController(AppModulesEnum.Auth, 'auth', RouteTypeEnum.PUBLIC)
export class AuthPublicController {
  constructor(private readonly _authenticationService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<UpdateResultModel> {
    return this._authenticationService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<AccessTokenAndRefreshTokenDto> {
    return this._authenticationService.signIn(signInDto);
  }
}
