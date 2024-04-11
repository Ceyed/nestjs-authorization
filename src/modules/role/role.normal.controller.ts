import { uuid } from '@libs/constants/uuid.constant';
import { AppController } from '@libs/decorators/app-controller.decorator';
import { GetInfo } from '@libs/decorators/custom-get.decorator';
import { PostInfo } from '@libs/decorators/custom-post.decorator';
import { PutInfo } from '@libs/decorators/custom-put.decorator';
import {
  DeleteInfo,
  GetWithPagination,
  QueryOrder,
  QueryPagination,
  User,
} from '@libs/decorators/index';
import { OrderDto, PaginationDto } from '@libs/dtos/common';
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '@libs/dtos/role';
import { RoleEntity } from '@libs/entities/role/role.entity';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { UserAuthModel } from '@libs/models/active-user-data.model';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { Body, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { Paginate } from 'libs/src/lib/classes';

@AppController(AppModulesEnum.Role, 'roles', RouteTypeEnum.NORMAL)
export class RoleNormalController {
  constructor(private readonly _roleService: RoleService) {}

  @GetWithPagination(
    'all',
    {
      summary: 'get all roles',
      description: 'this route returns all roles',
    },
    RoleEntity,
    'filters',
    FilterRoleDto,
  )
  async getAllWithPagination(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto,
    @Query('filters') filters: FilterRoleDto,
  ): Promise<Paginate<RoleEntity>> {
    const [roles, total] = await this._roleService.getAllWithPagination(pagination, order, filters);
    return new Paginate(roles, pagination.getPagination(total));
  }

  @GetInfo(':id', ['id'], {
    summary: 'get a role',
    description: 'this route returns a',
    outputType: RoleEntity,
  })
  getOne(@Param('id', ParseUUIDPipe) id: uuid): Promise<RoleEntity> {
    return this._roleService.getOneOrFail(id);
  }

  @PostInfo('', CreateRoleDto, false, {
    summary: 'create role',
    description: 'this route creates a role',
    outputType: RoleEntity,
  })
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this._roleService.create(createRoleDto);
  }

  @PutInfo(':id', ['id'], UpdateRoleDto, false, {
    summary: 'update a role',
    description: 'this route updates a role requested by the id put in the param',
    outputType: UpdateResultModel,
  })
  update(
    @Param('id', ParseUUIDPipe) id: uuid,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: UserAuthModel,
  ): Promise<UpdateResultModel> {
    return this._roleService.update(id, updateRoleDto, user);
  }

  @DeleteInfo(':id', ['id'], {
    summary: 'delete a role',
    description: 'this route deletes one role',
    outputType: UpdateResultModel,
  })
  delete(@Param('id', ParseUUIDPipe) id: uuid): Promise<UpdateResultModel> {
    return this._roleService.delete(id);
  }
}
