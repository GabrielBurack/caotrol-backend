import prisma from "../prisma";
import { tutor } from '@prisma/client';

class TutorRepository { 
    
    async create(data: Omit<tutor, 'id_tutor' | 'ativo'>): Promise<tutor>{
        return prisma.tutor.create({ data });
    }

    async findAll(): Promise<tutor[]> {
        return prisma.tutor.findMany();
    }

    //...

}

export default new TutorRepository();