import { AccessTokenGuard } from '@libs/guards/access-token.guard';
import { PrismaModules } from '@libs/modules/prisma';
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
  ],
  controllers: [UserNormalController],
  providers: [UserService, AccessTokenGuard],
})
export class UserModule {}
