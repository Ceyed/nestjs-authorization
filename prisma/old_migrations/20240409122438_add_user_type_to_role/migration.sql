/*
  Warnings:

  - Added the required column `type` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Administrator', 'Manager', 'Employee', 'Supervisor');

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "type" "UserType" NOT NULL;
