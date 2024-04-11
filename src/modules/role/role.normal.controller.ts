import { AppController } from '@libs/decorators/app-controller.decorator';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { RoleService } from './role.service';

@AppController(AppModulesEnum.Role, 'roles', RouteTypeEnum.NORMAL)
export class RoleNormalController {
  constructor(private readonly _roleService: RoleService) {}
}
