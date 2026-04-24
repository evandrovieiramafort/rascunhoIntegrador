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
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Falha ao carregar o carrinho.';
      this.visao.exibirErro(mensagem);
    }
  }

  async atualizarQuantidade(itemId: number, quantidade: number): Promise<void> {
    try {
      const carrinho = await this.servico.atualizarQuantidade(itemId, quantidade);
      this.visao.exibirCarrinho(carrinho);
      await this.servico.atualizarBadgeNav();
    } catch (erro) {
      if (erro instanceof Error && erro.name !== 'AbortError') {
        this.visao.exibirMensagemFeedback(erro.message);
        await this.carregarCarrinho();
      }
    }
  }

  async removerItem(itemId: number): Promise<void> {
    try {
      const carrinho = await this.servico.removerItem(itemId);
      this.visao.exibirCarrinho(carrinho);
      await this.servico.atualizarBadgeNav();
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Não foi possível remover o item.';
      this.visao.exibirMensagemFeedback(mensagem);
    }
  }
}