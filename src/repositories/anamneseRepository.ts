import prisma from "../prisma";
import { anamnese, Prisma } from "@prisma/client";

class AnamneseRepository {

  async create(data: Prisma.anamneseUncheckedCreateInput): Promise<anamnese> {
    return prisma.anamnese.create({
      data,
    });
  }
}

export default new AnamneseRepository();