import axios from 'axios';
import { NotFoundError } from '../helpers/ApiError';

class EnderecoService {
    
  async findByCep(cep: string) {
    try {
      // Remove caracteres não numéricos do CEP
      const cepFormatado = cep.replace(/\D/g, '');
      
      // Chama a API do ViaCEP
      const { data } = await axios.get(`https://viacep.com.br/ws/${cepFormatado}/json/`);

      if (data.erro) {
        throw new NotFoundError('CEP não encontrado.');
      }

      // Retorna os dados relevantes
      return {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.estado,
        uf: data.uf
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        throw new NotFoundError('CEP inválido.');
      }
      // Re-lança o erro se for um NotFoundError ou outro erro inesperado
      throw error;
    }
  }
}

export default new EnderecoService();