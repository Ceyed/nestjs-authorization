import { uuid } from '@libs/constants/uuid.constant';
import { AppController } from '@libs/decorators/app-controller.decorator';
import { GetWithPagination } from '@libs/decorators/custom-get-with-pagination.decorator';
import { GetInfo } from '@libs/decorators/custom-get.decorator';
import { PostInfo } from '@libs/decorators/custom-post.decorator';
import { PutInfo } from '@libs/decorators/custom-put.decorator';
import { DeleteInfo, PatchInfo } from '@libs/decorators/index';
import { QueryOrder } from '@libs/decorators/order-query';
import { QueryPagination } from '@libs/decorators/query-pagination';
import { OrderDto, PaginationDto } from '@libs/dtos/common';
import { CreateGroupDto, FilterGroupDto, UpdateGroupDto } from '@libs/dtos/group';
import { GroupEntity } from '@libs/entities/group/group.entity';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { Body, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { Paginate } from 'libs/src/lib/classes';
import { GroupService } from './group.service';

@AppController(AppModulesEnum.Groups, 'groups', RouteTypeEnum.NORMAL)
export class GroupNormalController {
  constructor(private readonly _groupService: GroupService) {}

  @GetWithPagination(
    'all',
    {
      summary: 'get all roles',
      description: 'this route returns all roles',
    },
    GroupEntity,
    'filters',
    FilterGroupDto,
  )
  async getAllWithPagination(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto,
    @Query('filters') filters: FilterGroupDto,
  ): Promise<Paginate<GroupEntity>> {
    const [roles, total] = await this._groupService.getAllWithPagination(
      pagination,
      order,
      filters,
    );
    return new Paginate(roles, pagination.getPagination(total));
  }

  @GetInfo(':id', ['id'], {
    summary: 'get a group',
    description: 'this route returns a group',
    outputType: GroupEntity,
  })
  getOne(@Param('id', ParseUUIDPipe) id: uuid): Promise<GroupEntity> {
    return this._groupService.getOneOrFail(id);
  }

  @PostInfo('', CreateGroupDto, false, {
    summary: 'create group',
    description: 'this route creates a group',
    outputType: GroupEntity,
  })
  createRole(@Body() createGroupDto: CreateGroupDto): Promise<GroupEntity> {
    return this._groupService.create(createGroupDto);
  }

  @PutInfo(':id/:userId', ['id', 'userId'], null, false, {
    summary: 'assign group to user',
    description: 'this route assigns the group to the user requested by the ids put in the params',
    outputType: UpdateResultModel,
  })
  assignGroupToUser(
    @Param('id', ParseUUIDPipe) id: uuid,
    @Param('userId', ParseUUIDPipe) userId: uuid,
  ): Promise<UpdateResultModel> {
    return this._groupService.assignToUser(id, userId);
  }

  @PutInfo(':id', ['id'], UpdateGroupDto, false, {
    summary: 'update a group',
    description: 'this route updates a group requested by the ids put in the params',
    outputType: UpdateResultModel,
  })
  update(
    @Param('id', ParseUUIDPipe) id: uuid,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<UpdateResultModel> {
    return this._groupService.update(id, updateGroupDto);
  }

  @PatchInfo('set-default/:id', ['id'], null, false, {
    summary: 'set default group',
    description: 'this route set default group requested by the id put in the param',
    outputType: UpdateResultModel,
  })
  setDefaultGroup(@Param('id', ParseUUIDPipe) id: uuid): Promise<UpdateResultModel> {
    return this._groupService.setDefaultGroup(id);
  }

  @DeleteInfo(':id', ['id'], {
    summary: 'delete a group',
    description: 'this route deletes one group',
    outputType: UpdateResultModel,
  })
  delete(@Param('id', ParseUUIDPipe) id: uuid): Promise<UpdateResultModel> {
    return this._groupService.delete(id);
  }
}
