import { uuid } from '@libs/constants/uuid.constant';
import { AppController, GetInfo, PutInfo, User } from '@libs/decorators/index';
import { UpdateUserDto } from '@libs/dtos/user';
import { UserEntity } from '@libs/entities/user/user.entity';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { UserAuthModel } from '@libs/models/active-user-data.model';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';

@AppController(AppModulesEnum.User, 'users', RouteTypeEnum.NORMAL)
export class UserNormalController {
  constructor(private readonly _userService: UserService) {}

  @GetInfo('profile', null, {
    summary: 'get current user profile',
    description: 'this route returns the current user profile',
    outputType: UserEntity,
  })
  getOne(@User() user: UserAuthModel): Promise<UserEntity> {
    return this._userService.getProfile(user);
  }

  @PutInfo('', null, UpdateUserDto, false, {
    summary: 'update current user',
    description: 'this route updates current user info',
    outputType: UpdateResultModel,
  })
  update(
    @Body() updateCurrentUserDto: UpdateUserDto,
    @User() user: UserAuthModel,
  ): Promise<UpdateResultModel> {
    return this._userService.updateCurrentUser(user, updateCurrentUserDto);
  }

  @PutInfo(':id', ['id'], UpdateUserDto, false, {
    summary: 'update any user info - need to have permission based on role',
    description: 'this route updates any user info by admin',
    outputType: UpdateResultModel,
  })
  updateAnyUser(
    @Param('id', ParseUUIDPipe) id: uuid,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserAuthModel,
  ): Promise<UpdateResultModel> {
    return this._userService.updateAnyUserWithLimitations(id, updateUserDto, user);
  }
}
