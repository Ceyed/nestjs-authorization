/*
  Warnings:

  - Changed the type of `type` on the `roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoleTypeEnum" AS ENUM ('Administrator', 'Manager', 'TeamLeader', 'Employee', 'Supervisor');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AppModulesEnum" ADD VALUE 'All';
ALTER TYPE "AppModulesEnum" ADD VALUE 'Groups';

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "type",
ADD COLUMN     "type" "RoleTypeEnum" NOT NULL;

-- DropEnum
DROP TYPE "UserType";
