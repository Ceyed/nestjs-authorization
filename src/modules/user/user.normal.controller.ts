import { uuid } from '@libs/constants/uuid.constant';
import { AppController, DeleteInfo, GetInfo, User } from '@libs/decorators/index';
import { UserEntity } from '@libs/entities/user/user.entity';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { UserAuthModel } from '@libs/models/active-user-data.model';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { Param, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';

@AppController(AppModulesEnum.User, 'users', RouteTypeEnum.NORMAL)
export class UserNormalController {
  constructor(private readonly _userService: UserService) {}

  @GetInfo('profile', null, {
    summary: 'get current user profile',
    description: 'this route returns the the current user profile',
    outputType: UserEntity,
  })
  getOne(@User() user: UserAuthModel): Promise<UserEntity> {
    return this._userService.getUserProfile(user);
  }

  @DeleteInfo(':id', ['id'], {
    summary: 'delete one user',
    description: "this route deletes one user with it's roles",
    outputType: UpdateResultModel,
  })
  remove(@Param('id', ParseUUIDPipe) id: uuid): Promise<UpdateResultModel> {
    return this._userService.removeUser(id);
  }
}
