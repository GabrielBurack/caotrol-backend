import PDFDocument from 'pdfkit';
import { NotFoundError } from '../helpers/ApiError';
import prescricaoRepository from '../repositories/prescricaoRepository';
import exameRepository from '../repositories/exameRepository';

// Interface para os dados do preview da Prescrição
interface PrescricaoPreviewData {
    nome_tutor: string;
    nome_animal: string;
    especie: string;
    raca: string; 
    nome_veterinario: string;
    crmv_veterinario: string;
    data_consulta: string;
    descricoes_prescricao: string[]; 
}

// Interface para os dados do preview do Exame
interface ExamePreviewData {
    nome_tutor: string;
    nome_animal: string;
    especie: string;
    raca: string; 
    nome_veterinario: string;
    crmv_veterinario: string;
    data_consulta: string;
    solicitacoes_exame: string[];
}

class DocumentoService {
  /**
   * Gera um PDF de uma prescrição com base nos dados fornecidos (preview).
   */
  async gerarPdfPrescricaoPreview(dados: PrescricaoPreviewData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A5', margin: 50 });
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // --- CONSTRUÇÃO DO PDF ---
        doc.fontSize(16).font('Helvetica-Bold').text('Clínica Veterinária Lauro Vet', { align: 'center' });
        doc.moveDown(3);
        doc.fontSize(14).font('Helvetica-Bold').text('RECEITUÁRIO', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(11).font('Helvetica-Bold').text('Tutor:', { continued: true }).font('Helvetica').text(` ${dados.nome_tutor}`);
        doc.font('Helvetica-Bold').text('Animal:', { continued: true }).font('Helvetica').text(` ${dados.nome_animal}`);
        doc.font('Helvetica-Bold').text('Espécie/Raça:', { continued: true }).font('Helvetica').text(` ${dados.especie} / ${dados.raca}`);
        doc.moveDown(2);

        doc.fontSize(12).font('Helvetica');
        dados.descricoes_prescricao.forEach((descricao, index) => {
            doc.text(`${index + 1}. ${descricao}`, {
                indent: 20,
                align: 'justify'
            });
            doc.moveDown(0.5);
        });

        doc.moveDown(4);
        doc.fontSize(11).font('Helvetica').text('________________________________', { align: 'center' });
        doc.font('Helvetica-Bold').text(dados.nome_veterinario, { align: 'center' });
        doc.font('Helvetica').text(`CRMV: ${dados.crmv_veterinario}`, { align: 'center' });
        doc.moveDown(3);
        const dataEmissao = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(dados.data_consulta));
        doc.fontSize(10).text(`Emitido em: ${dataEmissao}`, { align: 'right' });
        doc.end();
    });
  }

  /**
   * Gera um PDF de uma prescrição JÁ SALVA no banco.
   */
  async gerarPdfPrescricao(id_prescricao: number): Promise<Buffer> {
    const prescricao = await prescricaoRepository.findByIdComplet(id_prescricao);
    if (!prescricao) throw new NotFoundError('Prescrição não encontrada.');
    
    // Converte os dados do formato do banco para o formato do preview
    const dadosParaPdf: PrescricaoPreviewData = {
        nome_tutor: prescricao.consulta.animal.tutor.nome,
        nome_animal: prescricao.consulta.animal.nome,
        especie: prescricao.consulta.animal.raca.especie.nome,
        raca: prescricao.consulta.animal.raca.nome,
        nome_veterinario: prescricao.consulta.veterinario.nome,
        crmv_veterinario: prescricao.consulta.veterinario.crmv,
        data_consulta: prescricao.consulta.data.toISOString(),
        descricoes_prescricao: [prescricao.descricao || ''] 
    };

    return this.gerarPdfPrescricaoPreview(dadosParaPdf);
  }

  /**
   * Gera um PDF de uma solicitação de exame com base nos dados fornecidos (preview).
   */
  async gerarPdfExamePreview(dados: ExamePreviewData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A5', margin: 50 });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Layout similar ao de prescrição, mas com título e corpo diferentes
      doc.fontSize(16).font('Helvetica-Bold').text('Clínica Veterinária Lauro Vet', { align: 'center' });
      doc.moveDown(3);
      doc.fontSize(14).font('Helvetica-Bold').text('SOLICITAÇÃO DE EXAME', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(11).font('Helvetica-Bold').text('Tutor:', { continued: true }).font('Helvetica').text(` ${dados.nome_tutor}`);
      doc.font('Helvetica-Bold').text('Animal:', { continued: true }).font('Helvetica').text(` ${dados.nome_animal}`);
      doc.font('Helvetica-Bold').text('Espécie/Raça:', { continued: true }).font('Helvetica').text(` ${dados.especie} / ${dados.raca}`);
      doc.moveDown(2);
      
      doc.fontSize(12).font('Helvetica-Bold').text('Exames Solicitados:');
      doc.moveDown(0.5);
      
      doc.font('Helvetica');
      dados.solicitacoes_exame.forEach((solicitacao, index) => {
          doc.text(`${index + 1}. ${solicitacao}`, { indent: 20, align: 'justify' });
          doc.moveDown(0.5);
      });
      
      doc.moveDown(4);
      doc.fontSize(11).font('Helvetica').text('________________________________', { align: 'center' });
      doc.font('Helvetica-Bold').text(dados.nome_veterinario, { align: 'center' });
      doc.font('Helvetica').text(`CRMV: ${dados.crmv_veterinario}`, { align: 'center' });
      doc.moveDown(3);
      const dataEmissao = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(dados.data_consulta));
      doc.fontSize(10).text(`Emitido em: ${dataEmissao}`, { align: 'right' });
      doc.end();
    });
  }

  /**
   * Gera um PDF de uma solicitação de exame JÁ SALVA no banco.
   */
  async gerarPdfExame(id_exame: number): Promise<Buffer> {
    const exame = await exameRepository.findByIdComplet(id_exame);
    if (!exame) throw new NotFoundError('Solicitação de exame não encontrada.');

    const dadosParaPdf: ExamePreviewData = {
        nome_tutor: exame.consulta.animal.tutor.nome,
        nome_animal: exame.consulta.animal.nome,
        especie: exame.consulta.animal.raca.especie.nome,
        raca: exame.consulta.animal.raca.nome,
        nome_veterinario: exame.consulta.veterinario.nome,
        crmv_veterinario: exame.consulta.veterinario.crmv,
        data_consulta: exame.consulta.data.toISOString(),
        solicitacoes_exame: [exame.solicitacao || '']
    };
    
    return this.gerarPdfExamePreview(dadosParaPdf);
  }
}

export default new DocumentoService();