    import prisma from "../prisma";
    import { tutor } from '@prisma/client';

    class TutorRepository {
        // Criação de novo tutor
        async create(data: Omit<tutor, 'id_tutor' | 'ativo'>): Promise<tutor> {
            return prisma.tutor.create({
                data: {
                    ...data,
                    ativo: true 
                }
            });
        }

        // Retorna todos os tutores ativos
        async findAll(): Promise<tutor[]> {
            return prisma.tutor.findMany({
                where: { ativo: true }
            });
        }

        // Busca por ID (sem filtro de ativo)
        async findById(id: number): Promise<tutor | null> {
            return prisma.tutor.findUnique({
                where: { id_tutor: id }
            });
        }

        // Atualização de dados
        async update(id: number, data: Partial<tutor>): Promise<tutor> {
            return prisma.tutor.update({
                where: { id_tutor: id },
                data
            });
        }

        // Soft delete (marca como inativo)
        async deactivate(id: number): Promise<tutor> {
            return prisma.tutor.update({
                where: { id_tutor: id },
                data: { ativo: false }
            });
            // **Desativar todos os animais desse tutor**
        }

        // (Opcional) Delete real — somente para casos de manutenção/admin
        async hardDelete(id: number): Promise<tutor> {
            return prisma.tutor.delete({
                where: { id_tutor: id }
            });
        }

        // ?? Perguntar ao professor se precisa de um Reactivate
    }

    export default new TutorRepository();
