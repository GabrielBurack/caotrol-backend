import relatorioRepository from "../repositories/relatorioRepository";

class RelatorioService {
  async gerarRelatorioConsultas(dataInicio: Date, dataFim: Date) {
    if (dataInicio > dataFim) {
      throw new Error("A data de início não pode ser posterior à data de fim.");
    }

    const totalConsultas = await relatorioRepository.contarConsultasPorPeriodo(
      dataInicio,
      dataFim
    );

    return {
      periodo: {
        de: dataInicio.toISOString().split('T')[0], // Formata para YYYY-MM-DD
        ate: dataFim.toISOString().split('T')[0],
      },
      totalConsultas: totalConsultas,
    };
  }
}

export default new RelatorioService();