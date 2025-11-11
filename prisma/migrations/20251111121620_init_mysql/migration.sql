-- CreateTable
CREATE TABLE `agendamento` (
    `id_agenda` INTEGER NOT NULL AUTO_INCREMENT,
    `data_agenda` TIMESTAMP(6) NOT NULL,
    `data_exec` TIMESTAMP(6) NOT NULL,
    `data_conf` TIMESTAMP(6) NULL,
    `data_cancel` TIMESTAMP(6) NULL,
    `status` ENUM('pendente', 'agendada', 'confirmada', 'cancelada', 'nao_compareceu') NOT NULL,
    `id_tutor` INTEGER NOT NULL,
    `id_veterinario` INTEGER NOT NULL,
    `id_animal` INTEGER NOT NULL,
    `id_consulta` INTEGER NULL,
    `id_usuario` INTEGER NOT NULL,

    PRIMARY KEY (`id_agenda`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anamnese` (
    `id_anamnese` INTEGER NOT NULL AUTO_INCREMENT,
    `castrado` BOOLEAN NULL,
    `alergias` VARCHAR(191) NULL,
    `obs` VARCHAR(191) NULL,
    `id_consulta` INTEGER NOT NULL,

    PRIMARY KEY (`id_anamnese`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `animal` (
    `id_animal` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `data_nasc` DATE NOT NULL,
    `sexo` ENUM('M', 'F') NOT NULL,
    `temperamento` ENUM('tranquilo', 'agressivo', 'medroso') NULL,
    `porte` ENUM('pequeno', 'medio', 'grande') NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `id_tutor` INTEGER NOT NULL,
    `id_raca` INTEGER NOT NULL,

    PRIMARY KEY (`id_animal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cidade` (
    `id_cidade` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `id_estado` INTEGER NOT NULL,

    PRIMARY KEY (`id_cidade`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consulta` (
    `id_consulta` INTEGER NOT NULL AUTO_INCREMENT,
    `data` TIMESTAMP(6) NOT NULL,
    `freq` INTEGER NULL,
    `resp` INTEGER NULL,
    `tpc` DECIMAL(4, 2) NULL,
    `peso` DECIMAL(4, 2) NULL,
    `status` ENUM('pendente', 'finalizada', 'cancelada') NOT NULL,
    `temperatura` DECIMAL(4, 1) NULL,
    `queixa` VARCHAR(191) NULL,
    `suspeita` VARCHAR(191) NULL,
    `diagnostico` VARCHAR(191) NULL,
    `tratamento` VARCHAR(191) NULL,
    `mucosas` VARCHAR(255) NULL,
    `id_animal` INTEGER NOT NULL,
    `id_veterinario` INTEGER NOT NULL,

    PRIMARY KEY (`id_consulta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especie` (
    `id_especie` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_especie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado` (
    `id_estado` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `uf` CHAR(2) NOT NULL,

    UNIQUE INDEX `estado_uf_key`(`uf`),
    PRIMARY KEY (`id_estado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exame` (
    `id_exame` INTEGER NOT NULL AUTO_INCREMENT,
    `solicitacao` VARCHAR(191) NULL,
    `resultado` VARCHAR(191) NULL,
    `id_consulta` INTEGER NOT NULL,

    PRIMARY KEY (`id_exame`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prescricao` (
    `id_prescricao` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NULL,
    `id_consulta` INTEGER NOT NULL,

    PRIMARY KEY (`id_prescricao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `raca` (
    `id_raca` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `id_especie` INTEGER NOT NULL,

    PRIMARY KEY (`id_raca`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutor` (
    `id_tutor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `data_nasc` DATE NULL,
    `telefone` VARCHAR(20) NOT NULL,
    `cep` VARCHAR(8) NULL,
    `logradouro` VARCHAR(255) NULL,
    `num` VARCHAR(10) NULL,
    `bairro` VARCHAR(100) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `id_cidade` INTEGER NULL,

    UNIQUE INDEX `tutor_cpf_key`(`cpf`),
    PRIMARY KEY (`id_tutor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(50) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `tipo` ENUM('padrao', 'veterinario', 'admin') NOT NULL,
    `email_verificado` BOOLEAN NOT NULL DEFAULT false,
    `token_verificacao` VARCHAR(191) NULL,
    `reset_token` VARCHAR(191) NULL,
    `reset_token_expires` DATETIME(3) NULL,
    `id_tutor` INTEGER NULL,
    `id_veterinario` INTEGER NULL,

    UNIQUE INDEX `usuario_login_key`(`login`),
    UNIQUE INDEX `usuario_email_key`(`email`),
    UNIQUE INDEX `usuario_token_verificacao_key`(`token_verificacao`),
    UNIQUE INDEX `usuario_reset_token_key`(`reset_token`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vacina` (
    `id_vacina` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `data_aplic` DATE NOT NULL,
    `data_prox` DATE NULL,
    `status` VARCHAR(50) NULL,
    `dose` VARCHAR(191) NULL,
    `id_animal` INTEGER NOT NULL,

    PRIMARY KEY (`id_vacina`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `veterinario` (
    `id_veterinario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `crmv` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `veterinario_cpf_key`(`cpf`),
    UNIQUE INDEX `veterinario_crmv_key`(`crmv`),
    PRIMARY KEY (`id_veterinario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `agendamento` ADD CONSTRAINT `fk_agendamento_animal` FOREIGN KEY (`id_animal`) REFERENCES `animal`(`id_animal`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendamento` ADD CONSTRAINT `fk_agendamento_consulta` FOREIGN KEY (`id_consulta`) REFERENCES `consulta`(`id_consulta`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendamento` ADD CONSTRAINT `fk_agendamento_tutor` FOREIGN KEY (`id_tutor`) REFERENCES `tutor`(`id_tutor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendamento` ADD CONSTRAINT `fk_agendamento_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendamento` ADD CONSTRAINT `fk_agendamento_veterinario` FOREIGN KEY (`id_veterinario`) REFERENCES `veterinario`(`id_veterinario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anamnese` ADD CONSTRAINT `fk_anamnese_consulta` FOREIGN KEY (`id_consulta`) REFERENCES `consulta`(`id_consulta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `animal` ADD CONSTRAINT `fk_animal_raca` FOREIGN KEY (`id_raca`) REFERENCES `raca`(`id_raca`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `animal` ADD CONSTRAINT `fk_animal_tutor` FOREIGN KEY (`id_tutor`) REFERENCES `tutor`(`id_tutor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cidade` ADD CONSTRAINT `fk_cidade_estado` FOREIGN KEY (`id_estado`) REFERENCES `estado`(`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consulta` ADD CONSTRAINT `fk_consulta_animal` FOREIGN KEY (`id_animal`) REFERENCES `animal`(`id_animal`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consulta` ADD CONSTRAINT `fk_consulta_veterinario` FOREIGN KEY (`id_veterinario`) REFERENCES `veterinario`(`id_veterinario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exame` ADD CONSTRAINT `fk_exame_consulta` FOREIGN KEY (`id_consulta`) REFERENCES `consulta`(`id_consulta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescricao` ADD CONSTRAINT `fk_prescricao_consulta` FOREIGN KEY (`id_consulta`) REFERENCES `consulta`(`id_consulta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raca` ADD CONSTRAINT `fk_raca_especie` FOREIGN KEY (`id_especie`) REFERENCES `especie`(`id_especie`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tutor` ADD CONSTRAINT `fk_tutor_cidade` FOREIGN KEY (`id_cidade`) REFERENCES `cidade`(`id_cidade`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `fk_usuario_tutor` FOREIGN KEY (`id_tutor`) REFERENCES `tutor`(`id_tutor`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `fk_usuario_veterinario` FOREIGN KEY (`id_veterinario`) REFERENCES `veterinario`(`id_veterinario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vacina` ADD CONSTRAINT `fk_vacina_animal` FOREIGN KEY (`id_animal`) REFERENCES `animal`(`id_animal`) ON DELETE CASCADE ON UPDATE CASCADE;
