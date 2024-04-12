import { uuid } from '@libs/constants/uuid.constant';
import { AppController, DeleteInfo, PutInfo } from '@libs/decorators/index';
import { UpdateUserByAdminDto } from '@libs/dtos/user';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';

@AppController(AppModulesEnum.User, 'users', RouteTypeEnum.ADMIN)
export class UserAdminController {
  constructor(private readonly _userService: UserService) {}

  @PutInfo(':id', ['id'], UpdateUserByAdminDto, false, {
    summary: 'update any user info',
    description: 'this route updates any user info by admin',
    outputType: UpdateResultModel,
  })
  update(
    @Param('id', ParseUUIDPipe) id: uuid,
    @Body() updateUserByAdminDto: UpdateUserByAdminDto,
  ): Promise<UpdateResultModel> {
    return this._userService.updateByAdmin(id, updateUserByAdminDto);
  }

  @DeleteInfo(':id', ['id'], {
    summary: 'delete one user',
    description: "this route deletes one user with it's groups",
    outputType: UpdateResultModel,
  })
  remove(@Param('id', ParseUUIDPipe) id: uuid): Promise<UpdateResultModel> {
    return this._userService.remove(id);
  }
}
