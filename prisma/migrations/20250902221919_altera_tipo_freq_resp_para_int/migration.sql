/*
  Warnings:

  - You are about to alter the column `freq` on the `consulta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Integer`.
  - You are about to alter the column `resp` on the `consulta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."consulta" ALTER COLUMN "freq" SET DATA TYPE INTEGER,
ALTER COLUMN "resp" SET DATA TYPE INTEGER;
