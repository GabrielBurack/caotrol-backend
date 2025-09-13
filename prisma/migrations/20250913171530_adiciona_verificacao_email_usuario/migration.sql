/*
  Warnings:

  - A unique constraint covering the columns `[token_verificacao]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."usuario" ADD COLUMN     "email_verificado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token_verificacao" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "usuario_token_verificacao_key" ON "public"."usuario"("token_verificacao");
