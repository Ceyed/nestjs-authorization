import { Module } from '@nestjs/common';
import { PrismaModules } from '../prisma';
import { RedisHelperModule } from '../redis-helper';
import { RoleGuardService } from './role-guard.service';

@Module({
  imports: [PrismaModules, RedisHelperModule],
  providers: [RoleGuardService],
})
export class RoleGuardModule {}
