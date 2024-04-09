/*
  Warnings:

  - The values [USER,ROLE,PERMISSION] on the enum `AppModulesEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [CREATE,READ,UPDATE,DELETE,ALL] on the enum `PermissionEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `scope` on the `groups` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppModulesEnum_new" AS ENUM ('All', 'User', 'Role', 'Permission', 'Groups', 'Auth');
ALTER TABLE "groups" ALTER COLUMN "scopes" TYPE "AppModulesEnum_new"[] USING ("scopes"::text::"AppModulesEnum_new"[]);
ALTER TYPE "AppModulesEnum" RENAME TO "AppModulesEnum_old";
ALTER TYPE "AppModulesEnum_new" RENAME TO "AppModulesEnum";
DROP TYPE "AppModulesEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PermissionEnum_new" AS ENUM ('All', 'Create', 'Read', 'Update', 'Delete');
ALTER TABLE "groups" ALTER COLUMN "permissions" TYPE "PermissionEnum_new"[] USING ("permissions"::text::"PermissionEnum_new"[]);
ALTER TYPE "PermissionEnum" RENAME TO "PermissionEnum_old";
ALTER TYPE "PermissionEnum_new" RENAME TO "PermissionEnum";
DROP TYPE "PermissionEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "scope",
ADD COLUMN     "scopes" "AppModulesEnum"[];
