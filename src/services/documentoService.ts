import PDFDocument from 'pdfkit';
import path from 'path';
import { NotFoundError } from '../helpers/ApiError';
import prescricaoRepository from '../repositories/prescricaoRepository';
import exameRepository from '../repositories/exameRepository';
import consultaRepository from '../repositories/consultaRepository';

// Interface para os dados do preview da Prescrição
interface PrescricaoPreviewData {
    nome_tutor: string;
    nome_animal: string;
    especie: string;
    raca: string;
    idade: string;
    peso: string;
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
    idade: string; 
    peso: string; 
    nome_veterinario: string;
    crmv_veterinario: string;
    data_consulta: string;
    solicitacoes_exame: string[];
}

function calcularIdade(dataNasc: Date | null): string {
    if (!dataNasc) return 'N/A';
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idadeAnos = hoje.getFullYear() - nasc.getFullYear();
    let idadeMeses = hoje.getMonth() - nasc.getMonth();
    if (idadeMeses < 0 || (idadeMeses === 0 && hoje.getDate() < nasc.getDate())) {
        idadeAnos--;
        idadeMeses += 12;
    }
    return `${idadeAnos} anos e ${idadeMeses} meses`;
}

class DocumentoService {
  /**
   * Gera um PDF de uma prescrição com base nos dados fornecidos (preview).
   */
   async gerarPdfPrescricaoPreview(dados: PrescricaoPreviewData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 0 });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // --- CONSTRUÇÃO DO PDF COM TEMPLATE ---
      const templatePath = path.join(__dirname, '../../assets/modelo-receituario.png');
      doc.image(templatePath, 0, 0, { width: doc.page.width, height: doc.page.height });

      doc.fontSize(11).font('Helvetica');
      
      // --- POSICIONAMENTO DOS DADOS DINÂMICOS ---
      // ATENÇÃO: Os valores de X e Y são chutes iniciais. Você precisará ajustá-los.
      
      // Linha 1: Animal e Tutor
      doc.text(dados.nome_animal, 140, 179); // Posição (X, Y)
      doc.text(dados.nome_tutor, 350, 179);

      // Linha 2: Espécie e Raça
      doc.text(dados.especie, 140, 204);
      doc.text(dados.raca, 350, 204);

      // Linha 3: Idade e Peso (Exemplo)
      doc.text(dados.idade, 130, 229);
      doc.text(dados.peso, 350, 229);

      // Corpo da Prescrição (a partir da posição Y = 250)
      let yPosition = 320;
      dados.descricoes_prescricao.forEach(descricao => {
          doc.text("- " + descricao, 60, yPosition, {
              width: 470, // Largura da caixa de texto
              align: 'justify'
          });
          yPosition += 40; // Incrementa a posição Y para a próxima linha
      });

      doc.end();
    });
  }

  /**
   * NOVA FUNÇÃO: Gera um PDF com TODAS as prescrições de uma consulta.
   */
  async gerarPdfPrescricoesDaConsulta(id_consulta: number): Promise<Buffer> {
    const consulta = await consultaRepository.findById(id_consulta);
    if (!consulta) throw new NotFoundError('Consulta não encontrada.');

    // Prepara a lista de descrições a partir da consulta
    const descricoes = consulta.prescricao.map(p => p.descricao || '');
    
    const dadosParaPdf: PrescricaoPreviewData = {
        nome_tutor: consulta.animal.tutor.nome,
        nome_animal: consulta.animal.nome,
        especie: consulta.animal.raca.especie.nome,
        raca: consulta.animal.raca.nome,
        idade: calcularIdade(consulta.animal.data_nasc),
        peso: consulta.peso ? `${consulta.peso} Kg` : 'N/A',
        nome_veterinario: consulta.veterinario.nome,
        crmv_veterinario: consulta.veterinario.crmv,
        data_consulta: consulta.data.toISOString(),
        descricoes_prescricao: descricoes
    };

    // Reutiliza nossa função de preview que já sabe lidar com múltiplos itens
    return this.gerarPdfPrescricaoPreview(dadosParaPdf);
  }

  /**
   * NOVA FUNÇÃO: Gera um PDF com TODAS as solicitações de exame de uma consulta.
   */
  async gerarPdfExamesDaConsulta(id_consulta: number): Promise<Buffer> {
    const consulta = await consultaRepository.findById(id_consulta);
    if (!consulta) throw new NotFoundError('Consulta não encontrada.');

    const solicitacoes = consulta.exame.map(e => e.solicitacao || '');

    const dadosParaPdf: ExamePreviewData = {
        nome_tutor: consulta.animal.tutor.nome,
        nome_animal: consulta.animal.nome,
        especie: consulta.animal.raca.especie.nome,
        raca: consulta.animal.raca.nome,
        idade: calcularIdade(consulta.animal.data_nasc),
        peso: consulta.peso ? `${consulta.peso} Kg` : 'N/A',
        nome_veterinario: consulta.veterinario.nome,
        crmv_veterinario: consulta.veterinario.crmv,
        data_consulta: consulta.data.toISOString(),
        solicitacoes_exame: solicitacoes
    };

    return this.gerarPdfExamePreview(dadosParaPdf);
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
        idade: calcularIdade(prescricao.consulta.animal.data_nasc),
        peso: prescricao.consulta.peso ? `${prescricao.consulta.peso} Kg` : 'N/A',
        nome_veterinario: prescricao.consulta.veterinario.nome,
        crmv_veterinario: prescricao.consulta.veterinario.crmv,
        data_consulta: prescricao.consulta.data.toISOString(),
        descricoes_prescricao: [prescricao.descricao || ''] 
    };

    return this.gerarPdfPrescricaoPreview(dadosParaPdf);
  }

  /**
   * Gera um PDF de uma solicitação de exame usando o template de imagem.
   */
  async gerarPdfExamePreview(dados: ExamePreviewData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 0 });
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        const templatePath = path.join(__dirname, '../../assets/modelo-exame.png');
        doc.image(templatePath, 0, 0, { width: doc.page.width, height: doc.page.height });

        doc.fontSize(11).font('Helvetica');

        // Posições para os dados do exame (similares à prescrição)
        doc.text(dados.nome_animal, 140, 179);
        doc.text(dados.nome_tutor, 350, 179);
        doc.text(dados.especie, 140, 204);
        doc.text(dados.raca, 350, 204);

        doc.text(dados.idade, 130, 229);
        doc.text(dados.peso, 350, 229);
        
        let yPosition = 320;
        dados.solicitacoes_exame.forEach(solicitacao => {
            doc.text("- "+solicitacao, 60, yPosition, {
                width: 470,
                align: 'justify'
            });
            yPosition += 30;
        });

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
        idade: calcularIdade(exame.consulta.animal.data_nasc),
        peso: exame.consulta.peso ? `${exame.consulta.peso} Kg` : 'N/A',
        nome_veterinario: exame.consulta.veterinario.nome,
        crmv_veterinario: exame.consulta.veterinario.crmv,
        data_consulta: exame.consulta.data.toISOString(),
        solicitacoes_exame: [exame.solicitacao || '']
    };
    
    return this.gerarPdfExamePreview(dadosParaPdf);
  }
}

export default new DocumentoService();