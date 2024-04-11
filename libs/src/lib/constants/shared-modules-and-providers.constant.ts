import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '@src/configs/jwt.config';
import { redisConfig } from '@src/configs/redis.config';
import { AccessTokenGuard } from '../guards';
import { PrismaModules, RedisHelperModule, RoleGuardModule, RoleGuardService } from '../modules';

export const SHARED_MODULES_IMPORTS = [
  ConfigModule.forFeature(jwtConfig),
  ConfigModule.forFeature(redisConfig),
  RedisHelperModule,
  PrismaModules,
  RoleGuardModule,
];

export const SHARED_PROVIDERS = [AccessTokenGuard, RoleGuardService, JwtService];
