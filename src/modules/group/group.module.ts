import {
  SHARED_MODULES_IMPORTS,
  SHARED_PROVIDERS,
} from '@libs/constants/shared-modules-and-providers.constant';
import { Module } from '@nestjs/common';
import { GroupNormalController } from './group.normal.controller';
import { GroupService } from './group.service';

@Module({
  imports: [...SHARED_MODULES_IMPORTS],
  controllers: [GroupNormalController],
  providers: [...SHARED_PROVIDERS, GroupService],
})
export class GroupModule {}
