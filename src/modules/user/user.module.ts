import {
  SHARED_MODULES_IMPORTS,
  SHARED_PROVIDERS,
} from '@libs/constants/shared-modules-and-providers.constant';
import { Module } from '@nestjs/common';
import { UserNormalController } from './user.normal.controller';
import { UserService } from './user.service';

@Module({
  imports: [...SHARED_MODULES_IMPORTS],
  controllers: [UserNormalController],
  providers: [...SHARED_PROVIDERS, UserService],
})
export class UserModule {}
