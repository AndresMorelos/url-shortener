/*
  Warnings:

  - Added the required column `url` to the `urls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "urls" ADD COLUMN     "url" TEXT NOT NULL;
