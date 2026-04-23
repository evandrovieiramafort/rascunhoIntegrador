import { CarrinhoService } from '../services/CarrinhoService';
import type { CarrinhoViewInterface } from '../views/interfaces/CarrinhoViewInterface';

export class CarrinhoPresenter {
  private servico: CarrinhoService;

  constructor(private visao: CarrinhoViewInterface) {
    this.servico = new CarrinhoService();
  }

  async carregarCarrinho(): Promise<void> {
    this.visao.exibirCarregamento();
    try {
      const carrinho = await this.servico.obterCarrinho();
      this.visao.exibirCarrinho(carrinho);
      await this.servico.atualizarBadgeNav();
    } catch {
      this.visao.exibirErro('Falha ao carregar o carrinho.');
    }
  }

  async atualizarQuantidade(itemId: number, quantidade: number): Promise<void> {
    try {
      const carrinho = await this.servico.atualizarQuantidade(
        itemId,
        quantidade
      );
      this.visao.exibirCarrinho(carrinho);
      await this.servico.atualizarBadgeNav();
    } catch (erro: any) {
      if (!(erro.name === 'AbortError')) {
        this.visao.exibirMensagemFeedback(
          'Erro ao atualizar quantidade de produtos.',
        );
      }
    }
  }

  async removerItem(itemId: number): Promise<void> {
    try {
      const carrinho = await this.servico.removerItem(itemId);
      this.visao.exibirCarrinho(carrinho);
      await this.servico.atualizarBadgeNav();
    } catch {
      this.visao.exibirErro('Não foi possível remover o item do carrinho.');
    }
  }
}
