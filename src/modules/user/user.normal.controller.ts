import { uuid } from '@libs/constants/uuid.constant';
import {
  AppController,
  GetInfo,
  GetWithPagination,
  PutInfo,
  QueryOrder,
  QueryPagination,
  User,
} from '@libs/decorators/index';
import { OrderDto, PaginationDto } from '@libs/dtos/common';
import { UpdateUserDto } from '@libs/dtos/user';
import { FilterUserDto } from '@libs/dtos/user/filter-user.dto';
import { UserEntity } from '@libs/entities/user/user.entity';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { UserAuthModel } from '@libs/models/active-user-data.model';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { Body, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { Paginate } from 'libs/src/lib/classes';
import { UserService } from './user.service';

@AppController(AppModulesEnum.User, 'users', RouteTypeEnum.NORMAL)
export class UserNormalController {
  constructor(private readonly _userService: UserService) {}

  @GetWithPagination(
    'all',
    {
      summary: 'get all user',
      description: 'this route returns all users',
    },
    UserEntity,
    'filters',
    FilterUserDto,
  )
  async getAllWithPagination(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto,
    @Query('filters') filters: FilterUserDto,
  ): Promise<Paginate<UserEntity>> {
    const [users, total] = await this._userService.getAllWithPagination(pagination, order, filters);
    return new Paginate(users, pagination.getPagination(total));
  }

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
