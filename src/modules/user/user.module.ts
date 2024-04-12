import {
  SHARED_MODULES_IMPORTS,
  SHARED_PROVIDERS,
} from '@libs/constants/shared-modules-and-providers.constant';
import { Module } from '@nestjs/common';
import { BcryptService } from '../auth/hashing/bcrypt.service';
import { HashingService } from '../auth/hashing/hashing.service';
import { UserAdminController } from './user.admin.controller';
import { UserNormalController } from './user.normal.controller';
import { UserService } from './user.service';

@Module({
  imports: [...SHARED_MODULES_IMPORTS],
  controllers: [UserNormalController, UserAdminController],
  providers: [
    ...SHARED_PROVIDERS,
    UserService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class UserModule {}
