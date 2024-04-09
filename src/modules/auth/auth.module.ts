import { AccessTokenGuard } from '@libs/guards/access-token.guard';
import { PrismaModules } from '@libs/modules/prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/app/config/jwt.config';
import { AuthNormalController } from './auth.normal.controller';
import { AuthPublicController } from './auth.public.controller';
import { AuthenticationService } from './auth.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage/refresh-token-ids.storage';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    // RedisHelperModule,
    PrismaModules,
  ],
  controllers: [AuthPublicController, AuthNormalController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthenticationGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },
    AuthenticationService,
    AccessTokenGuard,
    RefreshTokenIdsStorage,
  ],
})
export class AuthModule {}
