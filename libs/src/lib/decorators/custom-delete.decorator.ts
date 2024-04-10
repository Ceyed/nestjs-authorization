import { applyDecorators, Delete, SetMetadata } from '@nestjs/common';
import { ROUTE_ACTION_METADATA } from '../constants/role-metadata.constant';
import { SharedUpdateRouteInfoDto } from '../dtos';
import { PermissionEnum } from '../enums';
import { getSharedDecorators } from './get-shared-decorators';

export function DeleteInfo(path: string, paramName: string[], info: SharedUpdateRouteInfoDto) {
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    Delete(path),
    SetMetadata(ROUTE_ACTION_METADATA, PermissionEnum.Delete),
  ];
  decorators.push(...getSharedDecorators(path, info, paramName));

  return applyDecorators(...decorators);
}
