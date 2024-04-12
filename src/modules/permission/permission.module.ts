import { SHARED_MODULES_IMPORTS, SHARED_PROVIDERS } from '@libs/constants/index';
import { Module } from '@nestjs/common';
import { PermissionNormalController } from './permission.normal.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [...SHARED_MODULES_IMPORTS],
  controllers: [PermissionNormalController],
  providers: [...SHARED_PROVIDERS, PermissionService],
})
export class PermissionModule {}
