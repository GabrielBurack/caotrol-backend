import prisma from "../prisma";
import { tutor } from '@prisma/client';

class TutorRepository {

    async create(data: Omit<tutor, 'id_tutor' | 'ativo'>): Promise<tutor> {
        return prisma.tutor.create({ data });
    }

    async findAll(): Promise<tutor[]> {
        return prisma.tutor.findMany();
    }

    async findById(id: number): Promise<tutor | null> {
        return prisma.tutor.findUnique({ where: { id_tutor: id } });
    }

    async update(id: number, data: Partial<tutor>): Promise<tutor> {
        return prisma.tutor.update({
            where: { id_tutor: id },
            data,
        });
    }

    async delete(id: number): Promise<tutor> {
        return prisma.tutor.delete({ where: { id_tutor: id } });
    }

}

export default new TutorRepository();