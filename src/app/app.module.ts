import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ConfigModule.forFeature(appConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
