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
      // Certifique-se que o caminho da imagem está correto
      const templatePath = path.join(__dirname, '../../assets/modelo-receituario.png');
      doc.image(templatePath, 0, 0, { width: doc.page.width, height: doc.page.height });

      doc.font('Helvetica').fontSize(11);
      
      // --- POSICIONAMENTO DOS DADOS DO CABEÇALHO ---
      // (Ajuste X e Y conforme seu template de imagem)
      
      // Linha 1: Animal e Tutor
      doc.text(dados.nome_animal, 140, 179);
      doc.text(dados.nome_tutor, 350, 179);

      // Linha 2: Espécie e Raça
      doc.text(dados.especie, 140, 204);
      doc.text(dados.raca, 350, 204);

      // Linha 3: Idade e Peso
      doc.text(dados.idade, 130, 229);
      doc.text(dados.peso, 350, 229);

      // --- CORPO DA PRESCRIÇÃO (LISTA DE TÓPICOS) ---
      let yPosition = 300; // Começando um pouco mais para cima
      const width = 470;   // Largura da área de texto
      const xPosition = 60; // Margem esquerda

      doc.fontSize(12); // Fonte um pouco maior para os remédios

      dados.descricoes_prescricao.forEach(descricao => {
          const textoFormatado = "- " + descricao;
          
          // Calcula a altura que este texto vai ocupar para não sobrepor o próximo
          const textHeight = doc.heightOfString(textoFormatado, { width: width });
          
          // Verifica se cabe na página, senão cria nova página (básico)
          if (yPosition + textHeight > 700) {
             doc.addPage();
             doc.image(templatePath, 0, 0, { width: doc.page.width, height: doc.page.height });
             yPosition = 150; 
          }

          doc.text(textoFormatado, xPosition, yPosition, {
              width: width,
              align: 'left' // Alinhado a esquerda fica melhor para listas
          });
          
          // Incrementa a posição Y baseado na altura do texto + um espaçamento (padding)
          yPosition += textHeight + 10; 
      });

      // --- RODAPÉ COM ASSINATURA DO VETERINÁRIO ---
      // Pega o veterinário enviado no `dados` (que agora vem do Logado no frontend)
      const footerY = 720; // Posição vertical lá embaixo
      
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text(dados.nome_veterinario, 0, footerY, { align: 'center' });
      
      doc.fontSize(10).font('Helvetica');
      doc.text(`CRMV: ${dados.crmv_veterinario}`, 0, footerY + 15, { align: 'center' });

      doc.end();
    });
  }

  /**
   * NOVA FUNÇÃO: Gera um PDF com TODAS as prescrições de uma consulta.
   */
  async gerarPdfPrescricoesDaConsulta(id_consulta: number): Promise<Buffer> {
    const consulta = await consultaRepository.findById(id_consulta);
    if (!consulta) throw new NotFoundError('Consulta não encontrada.');

    // FIX: Garante que cada linha vire um item da lista, mesmo vindo do banco
    const descricoes = consulta.prescricao
      .map(p => p.descricao || '')
      .join('\n') // Junta tudo
      .split('\n') // Separa por linha novamente
      .filter(line => line.trim() !== ''); // Remove vazios
    
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

    return this.gerarPdfPrescricaoPreview(dadosParaPdf);
  }

  /**
   * Gera um PDF com TODAS as solicitações de exame de uma consulta.
   */
  async gerarPdfExamesDaConsulta(id_consulta: number): Promise<Buffer> {
    const consulta = await consultaRepository.findById(id_consulta);
    if (!consulta) throw new NotFoundError('Consulta não encontrada.');

    const solicitacoes = consulta.exame
      .map(e => e.solicitacao || '')
      .join('\n')
      .split('\n')
      .filter(line => line.trim() !== '');

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
    
    // FIX: Divide a string do banco em array usando \n como separador
    const listaDescricao = (prescricao.descricao || '').split('\n').filter(d => d.trim() !== '');

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
        descricoes_prescricao: listaDescricao 
    };

    return this.gerarPdfPrescricaoPreview(dadosParaPdf);
  }

  /**
   * Gera um PDF de uma solicitação de exame Preview.
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

        doc.font('Helvetica').fontSize(11);

        doc.text(dados.nome_animal, 140, 179);
        doc.text(dados.nome_tutor, 350, 179);
        doc.text(dados.especie, 140, 204);
        doc.text(dados.raca, 350, 204);

        doc.text(dados.idade, 130, 229);
        doc.text(dados.peso, 350, 229);
        
        let yPosition = 300;
        const width = 470;
        const xPosition = 60;

        doc.fontSize(12);

        dados.solicitacoes_exame.forEach(solicitacao => {
            const textoFormatado = "- " + solicitacao;
            const textHeight = doc.heightOfString(textoFormatado, { width: width });
            
            if (yPosition + textHeight > 700) {
               doc.addPage();
               doc.image(templatePath, 0, 0, { width: doc.page.width, height: doc.page.height });
               yPosition = 150; 
            }

            doc.text(textoFormatado, xPosition, yPosition, {
                width: width,
                align: 'left'
            });
            yPosition += textHeight + 10;
        });

        // --- RODAPÉ EXAMES ---
        const footerY = 720;
        doc.fontSize(11).font('Helvetica-Bold');
        doc.text(dados.nome_veterinario, 0, footerY, { align: 'center' });
        doc.fontSize(10).font('Helvetica');
        doc.text(`CRMV: ${dados.crmv_veterinario}`, 0, footerY + 15, { align: 'center' });

        doc.end();
    });
  }

  /**
   * Gera um PDF de uma solicitação de exame JÁ SALVA no banco.
   */
  async gerarPdfExame(id_exame: number): Promise<Buffer> {
    const exame = await exameRepository.findByIdComplet(id_exame);
    if (!exame) throw new NotFoundError('Solicitação de exame não encontrada.');

    // FIX: Divide a string do banco
    const listaSolicitacao = (exame.solicitacao || '').split('\n').filter(s => s.trim() !== '');

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
        solicitacoes_exame: listaSolicitacao
    };
    
    return this.gerarPdfExamePreview(dadosParaPdf);
  }
}

export default new DocumentoService();