import { CreateRoleDto } from '@libs/dtos/role';
import { RoleEntity } from '@libs/entities/role/role.entity';
import { PrismaService } from '@libs/modules/prisma';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(private readonly _prismaService: PrismaService) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    await this._createRoleDtoValidation(createRoleDto);
    return this._prismaService.role.create({ data: createRoleDto });
  }

  private async _createRoleDtoValidation(createRoleDto: CreateRoleDto): Promise<void> {
    const priorityExists: number = await this._prismaService.role.count({
      where: { priority: createRoleDto.priority },
    });
    if (!!priorityExists) {
      throw new ConflictException('The priority is used before. Choose another order');
    }
  }
}
