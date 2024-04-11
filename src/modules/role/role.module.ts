import {
  SHARED_MODULES_IMPORTS,
  SHARED_PROVIDERS,
} from '@libs/constants/shared-modules-and-providers.constant';
import { Module } from '@nestjs/common';
import { RoleNormalController } from './role.normal.controller';
import { RoleService } from './role.service';

@Module({
  imports: [...SHARED_MODULES_IMPORTS],
  controllers: [RoleNormalController],
  providers: [...SHARED_PROVIDERS, RoleService],
})
export class RoleModule {}
