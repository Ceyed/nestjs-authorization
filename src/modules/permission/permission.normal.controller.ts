import { AppController } from '@libs/decorators/app-controller.decorator';
import { GetInfo } from '@libs/decorators/custom-get.decorator';
import { DeleteInfo, PostInfo, PutInfo } from '@libs/decorators/index';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { PermissionService } from './permission.service';

@AppController(AppModulesEnum.Permission, 'permissions', RouteTypeEnum.NORMAL)
export class PermissionNormalController {
  constructor(private readonly _permissionService: PermissionService) {}

  @GetInfo('', null, {
    summary: 'dummy get route',
    description: 'this is a dummy get route just for testing groups and permissions',
    outputType: String,
  })
  getOne(): String {
    return this._permissionService.get();
  }

  @PostInfo('', null, false, {
    summary: 'dummy post route',
    description: 'this is a dummy post route just for testing groups and permissions',
    outputType: String,
  })
  create(): String {
    return this._permissionService.post();
  }

  @PutInfo('', null, null, false, {
    summary: 'dummy put route',
    description: 'this is a dummy put route just for testing groups and permissions',
    outputType: String,
  })
  update(): String {
    return this._permissionService.put();
  }

  @DeleteInfo('', null, {
    summary: 'dummy delete route',
    description: 'this is a dummy delete route just for testing groups and permissions',
    outputType: String,
  })
  delete(): String {
    return this._permissionService.delete();
  }
}
