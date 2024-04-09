import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';
import { PrismaModules } from '@libs/modules/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ConfigModule.forFeature(appConfig),
    ConfigModule.forFeature(jwtConfig),
    AuthModule,
    PrismaModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
