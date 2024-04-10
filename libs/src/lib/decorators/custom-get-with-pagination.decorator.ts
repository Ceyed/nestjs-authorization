import { Get, SetMetadata, Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ExternalDocumentationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { PermissionEnum } from '@prisma/client';
import { ROUTE_ACTION_METADATA } from '../constants/role-metadata.constant';
import {
  ApiCustomParamOption,
  ApiFilterQuery,
  ApiQueryOrder,
  ApiQueryPagination,
} from '../decorators';
import { applyRouteParams } from '../utils/apply-route-params';
import { ApiPaginatedResponse } from './api-paginated-response';

/**
 *
 * @param path
 * @param info
 * @param paginationEntityResponse
 * @param queryName
 * @param queryType
 * @param paramNames
 * @param overrideResponse
 **/
export function GetWithPagination(
  path: string,
  info: {
    summary: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
  },
  paginationEntityResponse: Type<any>,
  queryName?: string,
  queryType?: Type<unknown>,
  paramNames?: string[] | Record<string, ApiCustomParamOption>,
  overrideResponse?: boolean,
) {
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    Get(path !== '/' && path !== '' ? `/paginated/${path}` : 'paginated'),
    SetMetadata(ROUTE_ACTION_METADATA, PermissionEnum.Read),
  ];
  decorators.push(ApiQueryOrder(), ApiQueryPagination(), ApiOperation(info));

  if (overrideResponse) {
    decorators.push(
      ApiOkResponse({
        type: () => paginationEntityResponse,
      }),
    );
  } else {
    decorators.push(ApiPaginatedResponse(paginationEntityResponse));
  }

  if (queryName) {
    decorators.push(ApiFilterQuery(queryName, queryType as Function));
  }
  if (paramNames && paramNames?.length) {
    decorators.push(...applyRouteParams(path, paramNames));
  }

  return applyDecorators(...decorators);
}
