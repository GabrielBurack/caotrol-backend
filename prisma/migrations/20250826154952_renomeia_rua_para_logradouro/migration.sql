/*
  Warnings:

  - You are about to drop the column `rua` on the `tutor` table. All the data in the column will be lost.
  - You are about to alter the column `cep` on the `tutor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(8)` to `VarChar(7)`.

*/
-- AlterTable
ALTER TABLE "public"."tutor" DROP COLUMN "rua",
ADD COLUMN     "logradouro" VARCHAR(255),
ALTER COLUMN "cep" SET DATA TYPE VARCHAR(7);
