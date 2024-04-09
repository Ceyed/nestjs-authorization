import { MODULE_CUSTOM_METADATA, ROUTE_METADATA } from '@libs/constants/role-metadata.constant';
import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { RouteTypeEnum } from '@libs/enums/route-type.enum';
import { Controller, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';

import { ClassConstructor } from 'class-transformer';
import { AuthenticationGuard } from '../guards';

export function AppController(
  module: AppModulesEnum,
  controllerPath: string,
  routeType = RouteTypeEnum.NORMAL,
) {
  const [decorators, guards] = _getDecoratorAndGuards(module, controllerPath, routeType);
  if (routeType !== RouteTypeEnum.PUBLIC) {
    decorators.push(UseGuards(...guards));
  }

  return applyDecorators(...decorators);
}

function _getDecoratorAndGuards(
  module: SwaggerEnumType,
  controllerPath: string,
  routeType = RouteTypeEnum.NORMAL,
): [Array<ClassDecorator | MethodDecorator | PropertyDecorator>, ClassConstructor<any>[]] {
  const guards = [];
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    SetMetadata(MODULE_CUSTOM_METADATA, module),
    ApiTags(module as string),
  ];

  const path: string = _getPathPrefix(routeType) + controllerPath;

  if (routeType !== RouteTypeEnum.PUBLIC) {
    guards.push(AuthenticationGuard);
    decorators.push(ApiBearerAuth());
  }

  decorators.push(SetMetadata(ROUTE_METADATA, routeType), Controller(path));
  return [decorators, guards];
}

function _getPathPrefix(routeType: RouteTypeEnum): string {
  switch (routeType) {
    case RouteTypeEnum.ADMIN:
      return 'admin/';
    case RouteTypeEnum.NORMAL:
      return 'normal/';
    default:
      return 'public/';
  }
}
