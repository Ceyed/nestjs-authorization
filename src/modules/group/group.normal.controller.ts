import { uuid } from '@libs/constants/uuid.constant';
import { AppController } from '@libs/decorators/app-controller.decorator';
import { PostInfo } from '@libs/decorators/custom-post.decorator';
import { PutInfo } from '@libs/decorators/custom-put.decorator';
import { CreateGroupDto } from '@libs/dtos/group';
import { GroupEntity } from '@libs/entities/group/group.entity';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { GroupService } from './group.service';

@AppController(AppModulesEnum.Groups, 'groups', RouteTypeEnum.NORMAL)
export class GroupNormalController {
  constructor(private readonly _groupService: GroupService) {}

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
  update(
    @Param('id', ParseUUIDPipe) id: uuid,
    @Param('userId', ParseUUIDPipe) userId: uuid,
  ): Promise<UpdateResultModel> {
    return this._groupService.assignToUser(id, userId);
  }
}
