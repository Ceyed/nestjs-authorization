import { AccessTokenGuard } from '@libs/guards/access-token.guard';
import { PrismaModules } from '@libs/modules/prisma';
import { RedisHelperModule } from '@libs/modules/redis-helper';
import { RoleGuardModule, RoleGuardService } from '@libs/modules/role-guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/app/config/jwt.config';
import { UserNormalController } from './user.normal.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    PrismaModules,
    RoleGuardModule,
    RedisHelperModule,
  ],
  controllers: [UserNormalController],
  providers: [UserService, AccessTokenGuard, RoleGuardService],
})
export class UserModule {}
