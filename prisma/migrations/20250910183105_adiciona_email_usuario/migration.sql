/*
  Warnings:

  - A unique constraint covering the columns `[reset_token]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."usuario" ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "reset_token" TEXT,
ADD COLUMN     "reset_token_expires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_reset_token_key" ON "public"."usuario"("reset_token");
