import {
  SHARED_MODULES_IMPORTS,
  SHARED_PROVIDERS,
} from '@libs/constants/shared-modules-and-providers.constant';
import { Module } from '@nestjs/common';
import { AuthNormalController } from './auth.normal.controller';
import { AuthPublicController } from './auth.public.controller';
import { AuthenticationService } from './auth.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage/refresh-token-ids.storage';

@Module({
  imports: [...SHARED_MODULES_IMPORTS],
  controllers: [AuthPublicController, AuthNormalController],
  providers: [
    ...SHARED_PROVIDERS,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthenticationService,
    RefreshTokenIdsStorage,
  ],
})
export class AuthModule {}
