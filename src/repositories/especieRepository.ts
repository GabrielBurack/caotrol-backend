import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class EspecieRepository {
    async create(data: { nome: string }) {
        return prisma.especie.create({ data });
    }

    async findAll() {
        return prisma.especie.findMany();
    }

    async findById(id: number) {
        return prisma.especie.findUnique({
            where: { id_especie: id },
        });
    }

    async update(id: number, data: { nome: string }) {
        return prisma.especie.update({
            where: { id_especie: id },
            data,
        });
    }

    async delete(id: number) {
        return prisma.especie.delete({
            where: { id_especie: id },
        });
    }

    async findByName(name: string) {
        return prisma.especie.findFirst({
            where: {
                nome: {
                    equals: name,
                    mode: 'insensitive' 
                }
            }
        });
    }
}

export default new EspecieRepository();