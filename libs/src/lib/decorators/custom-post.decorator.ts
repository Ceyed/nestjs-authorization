import { applyDecorators, Post, SetMetadata, Type } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import { ROUTE_ACTION_METADATA } from '../constants/role-metadata.constant';
import { getSharedDecorators } from './get-shared-decorators';
import { PermissionEnum } from '../enums';
import { SharedCustomRouteInfoDto } from '../dtos';

export function PostInfo(
  path: string,
  inputType: Type<unknown> | ClassConstructor<any>,
  inputIsArray = false,
  info: SharedCustomRouteInfoDto,
  paramNames?: string[],
) {
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    Post(path),
    SetMetadata(ROUTE_ACTION_METADATA, PermissionEnum.Create),
  ];

  if (inputType) {
    decorators.push(ApiBody({ type: () => inputType, isArray: inputIsArray }));
  }
  decorators.push(...getSharedDecorators(path, info, paramNames));

  return applyDecorators(...decorators);
}
