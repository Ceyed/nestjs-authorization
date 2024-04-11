import { PrismaService } from '@libs/modules/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(private readonly _prismaService: PrismaService) {}
}
