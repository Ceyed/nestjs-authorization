import { AccessTokenGuard } from '@libs/guards/access-token.guard';
import { PrismaModules } from '@libs/modules/prisma';
import { RedisHelperModule } from '@libs/modules/redis-helper';
import { RedisHelperService } from '@libs/modules/redis-helper/redis-helper.service';
import { RoleGuardModule, RoleGuardService } from '@libs/modules/role-guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/app/config/jwt.config';
import { redisConfig } from 'src/app/config/redis.config';
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
    ConfigModule.forFeature(redisConfig),
    PrismaModules,
    RoleGuardModule,
    RedisHelperModule,
  ],
  controllers: [AuthPublicController, AuthNormalController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthenticationService,
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    RoleGuardService,
    RedisHelperService,
  ],
})
export class AuthModule {}
