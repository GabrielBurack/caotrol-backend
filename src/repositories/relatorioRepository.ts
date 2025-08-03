import prisma from "../prisma";

class RelatorioRepository {
  /**
   * Conta o número de consultas realizadas dentro de um intervalo de datas.
   * @param dataInicio - A data de início do período.
   * @param dataFim - A data de fim do período.
   */
  async contarConsultasPorPeriodo(dataInicio: Date, dataFim: Date): Promise<number> {
    return prisma.consulta.count({
      where: {
        data: {
          gte: dataInicio, 
          lte: dataFim,    
        },
        status: 'finalizada'
      },
    });
  }
}

export default new RelatorioRepository();