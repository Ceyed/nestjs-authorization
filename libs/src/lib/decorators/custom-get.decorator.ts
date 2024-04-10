import { applyDecorators, Get, SetMetadata, Type } from '@nestjs/common';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { ROUTE_ACTION_METADATA } from '../constants/role-metadata.constant';
import { SharedCustomRouteInfoDto } from '../dtos';
import { PermissionEnum } from '../enums';
import { ApiFilterQuery } from './api-filter-query';
import { getSharedDecorators } from './get-shared-decorators';

export type ApiCustomParamOption = { enum: SwaggerEnumType };

export function GetInfo(
  path: string,
  paramNames: string[] | Record<string, ApiCustomParamOption>,
  info: SharedCustomRouteInfoDto,
  queryName?: string,
  queryType?: Type<unknown>,
) {
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    Get(path),
    SetMetadata(ROUTE_ACTION_METADATA, PermissionEnum.Read),
  ];

  decorators.push(...getSharedDecorators(path, info, paramNames));

  if (queryName) {
    decorators.push(ApiFilterQuery(queryName, queryType as Function));
  }
  return applyDecorators(...decorators);
}
