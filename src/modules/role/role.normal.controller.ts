import { AppController } from '@libs/decorators/app-controller.decorator';
import { PostInfo } from '@libs/decorators/custom-post.decorator';
import { CreateRoleDto } from '@libs/dtos/role';
import { RoleEntity } from '@libs/entities/role/role.entity';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { Body } from '@nestjs/common';
import { RoleService } from './role.service';

@AppController(AppModulesEnum.Role, 'roles', RouteTypeEnum.NORMAL)
export class RoleNormalController {
  constructor(private readonly _roleService: RoleService) {}

  @PostInfo('create-role', CreateRoleDto, false, {
    summary: 'create role',
    description: 'this route creates a role',
    outputType: RoleEntity,
  })
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this._roleService.createRole(createRoleDto);
  }
}
