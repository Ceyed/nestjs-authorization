import { PrismaClient } from '@prisma/client';
import { defaultUserGroups } from './seed-default-user-groups';
import { rolesData } from './seed-roles';

const prisma = new PrismaClient();

async function seed() {
  try {
    // * Seed default roles
    console.log('Starting default roles');
    await prisma.role.createMany({
      data: rolesData,
    });
    console.log('Roles seeded successfully');

    // * Seed default groups
    console.log('Starting default groups');
    for (const groupData of defaultUserGroups) {
      await prisma.group.create({
        data: {
          name: groupData.name,
          roleId: groupData.roleId,
          scopes: { set: groupData.scopes },
          permissions: { set: groupData.permissions },
        },
      });
    }
    console.log('Groups seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
