-- CreateEnum
CREATE TYPE "porte_enum" AS ENUM ('pequeno', 'medio', 'grande');

-- CreateEnum
CREATE TYPE "sexo_enum" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "status_agenda_enum" AS ENUM ('pendente', 'agendada', 'confirmada', 'cancelada');

-- CreateEnum
CREATE TYPE "status_consulta_enum" AS ENUM ('pendente', 'finalizada', 'cancelada');

-- CreateEnum
CREATE TYPE "temperamento_enum" AS ENUM ('tranquilo', 'agressivo', 'medroso');

-- CreateEnum
CREATE TYPE "tipo_usuario_enum" AS ENUM ('padrao', 'veterinario', 'admin');

-- CreateTable
CREATE TABLE "agendamento" (
    "id_agenda" SERIAL NOT NULL,
    "data_agenda" TIMESTAMP(6) NOT NULL,
    "data_exec" TIMESTAMP(6) NOT NULL,
    "data_conf" TIMESTAMP(6),
    "data_cancel" TIMESTAMP(6),
    "status" "status_agenda_enum" NOT NULL,
    "id_tutor" INTEGER NOT NULL,
    "id_veterinario" INTEGER NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "id_consulta" INTEGER,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "agendamento_pkey" PRIMARY KEY ("id_agenda")
);

-- CreateTable
CREATE TABLE "anamnese" (
    "id_anamnese" SERIAL NOT NULL,
    "castrado" BOOLEAN,
    "alergias" TEXT,
    "obs" TEXT,
    "id_consulta" INTEGER NOT NULL,

    CONSTRAINT "anamnese_pkey" PRIMARY KEY ("id_anamnese")
);

-- CreateTable
CREATE TABLE "animal" (
    "id_animal" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "data_nasc" DATE NOT NULL,
    "sexo" "sexo_enum" NOT NULL,
    "temperamento" "temperamento_enum",
    "porte" "porte_enum",
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "id_tutor" INTEGER NOT NULL,
    "id_raca" INTEGER NOT NULL,

    CONSTRAINT "animal_pkey" PRIMARY KEY ("id_animal")
);

-- CreateTable
CREATE TABLE "cidade" (
    "id_cidade" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "id_estado" INTEGER NOT NULL,

    CONSTRAINT "cidade_pkey" PRIMARY KEY ("id_cidade")
);

-- CreateTable
CREATE TABLE "consulta" (
    "id_consulta" SERIAL NOT NULL,
    "data" TIMESTAMP(6) NOT NULL,
    "freq" DECIMAL(4,2),
    "resp" DECIMAL(4,2),
    "tpc" DECIMAL(4,2),
    "peso" DECIMAL(4,2),
    "status" "status_consulta_enum" NOT NULL,
    "temperatura" DECIMAL(4,1),
    "queixa" TEXT,
    "suspeita" TEXT,
    "diagnostico" TEXT,
    "tratamento" TEXT,
    "mucosas" VARCHAR(255),
    "id_animal" INTEGER NOT NULL,
    "id_veterinario" INTEGER NOT NULL,

    CONSTRAINT "consulta_pkey" PRIMARY KEY ("id_consulta")
);

-- CreateTable
CREATE TABLE "especie" (
    "id_especie" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,

    CONSTRAINT "especie_pkey" PRIMARY KEY ("id_especie")
);

-- CreateTable
CREATE TABLE "estado" (
    "id_estado" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "uf" CHAR(2) NOT NULL,

    CONSTRAINT "estado_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "exame" (
    "id_exame" SERIAL NOT NULL,
    "solicitacao" TEXT,
    "resultado" TEXT,
    "id_consulta" INTEGER NOT NULL,

    CONSTRAINT "exame_pkey" PRIMARY KEY ("id_exame")
);

-- CreateTable
CREATE TABLE "prescricao" (
    "id_prescricao" SERIAL NOT NULL,
    "descricao" TEXT,
    "id_consulta" INTEGER NOT NULL,

    CONSTRAINT "prescricao_pkey" PRIMARY KEY ("id_prescricao")
);

-- CreateTable
CREATE TABLE "raca" (
    "id_raca" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "id_especie" INTEGER NOT NULL,

    CONSTRAINT "raca_pkey" PRIMARY KEY ("id_raca")
);

-- CreateTable
CREATE TABLE "tutor" (
    "id_tutor" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "data_nasc" DATE,
    "telefone" VARCHAR(20) NOT NULL,
    "cep" VARCHAR(8),
    "rua" VARCHAR(255),
    "num" VARCHAR(10),
    "bairro" VARCHAR(100),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "id_cidade" INTEGER,

    CONSTRAINT "tutor_pkey" PRIMARY KEY ("id_tutor")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "tipo" "tipo_usuario_enum" NOT NULL,
    "id_tutor" INTEGER,
    "id_veterinario" INTEGER,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "vacina" (
    "id_vacina" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "data_aplic" DATE NOT NULL,
    "data_prox" DATE,
    "status" VARCHAR(50),
    "id_animal" INTEGER NOT NULL,

    CONSTRAINT "vacina_pkey" PRIMARY KEY ("id_vacina")
);

-- CreateTable
CREATE TABLE "veterinario" (
    "id_veterinario" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "crmv" VARCHAR(20) NOT NULL,

    CONSTRAINT "veterinario_pkey" PRIMARY KEY ("id_veterinario")
);

-- CreateIndex
CREATE UNIQUE INDEX "estado_uf_key" ON "estado"("uf");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_cpf_key" ON "tutor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_login_key" ON "usuario"("login");

-- CreateIndex
CREATE UNIQUE INDEX "veterinario_cpf_key" ON "veterinario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "veterinario_crmv_key" ON "veterinario"("crmv");

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "fk_agendamento_animal" FOREIGN KEY ("id_animal") REFERENCES "animal"("id_animal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "fk_agendamento_consulta" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id_consulta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "fk_agendamento_tutor" FOREIGN KEY ("id_tutor") REFERENCES "tutor"("id_tutor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "fk_agendamento_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "fk_agendamento_veterinario" FOREIGN KEY ("id_veterinario") REFERENCES "veterinario"("id_veterinario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anamnese" ADD CONSTRAINT "fk_anamnese_consulta" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id_consulta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "fk_animal_raca" FOREIGN KEY ("id_raca") REFERENCES "raca"("id_raca") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "fk_animal_tutor" FOREIGN KEY ("id_tutor") REFERENCES "tutor"("id_tutor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cidade" ADD CONSTRAINT "fk_cidade_estado" FOREIGN KEY ("id_estado") REFERENCES "estado"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "fk_consulta_animal" FOREIGN KEY ("id_animal") REFERENCES "animal"("id_animal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "fk_consulta_veterinario" FOREIGN KEY ("id_veterinario") REFERENCES "veterinario"("id_veterinario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exame" ADD CONSTRAINT "fk_exame_consulta" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id_consulta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescricao" ADD CONSTRAINT "fk_prescricao_consulta" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id_consulta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raca" ADD CONSTRAINT "fk_raca_especie" FOREIGN KEY ("id_especie") REFERENCES "especie"("id_especie") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor" ADD CONSTRAINT "fk_tutor_cidade" FOREIGN KEY ("id_cidade") REFERENCES "cidade"("id_cidade") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_tutor" FOREIGN KEY ("id_tutor") REFERENCES "tutor"("id_tutor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_veterinario" FOREIGN KEY ("id_veterinario") REFERENCES "veterinario"("id_veterinario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacina" ADD CONSTRAINT "fk_vacina_animal" FOREIGN KEY ("id_animal") REFERENCES "animal"("id_animal") ON DELETE CASCADE ON UPDATE CASCADE;
