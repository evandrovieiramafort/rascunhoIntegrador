import { ItemService } from '../services/ItemService';
import { CarrinhoService } from '../services/CarrinhoService';
import type { DetalheItemViewInterface } from '../views/interfaces/DetalheItemViewInterface';
import type { ItemDTO } from '../domain/ItemDTO';
import { navegarPara } from '../utils/Navegacao';

export class DetalhePresenter {
  private servicoItem: ItemService;
  private servicoCarrinho: CarrinhoService;

  constructor(private visao: DetalheItemViewInterface) {
    this.servicoItem = new ItemService();
    this.servicoCarrinho = new CarrinhoService();
  }

  async carregarDetalhes(id: number): Promise<void> {
    this.visao.exibirCarregamento();
    try {
      const item = await this.servicoItem.obterPorId(id);
      const qtdNoCarrinho = await this.servicoCarrinho.obterQuantidadeItem(id);
      this.visao.exibirDetalhes(item, qtdNoCarrinho);
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "Falha ao carregar detalhes";
      this.visao.exibirErro(mensagem);
    }
  }

  async adicionarAoCarrinho(item: ItemDTO, quantidade: number): Promise<void> {
    try {
      await this.servicoCarrinho.adicionarItem(item, quantidade);
      await this.servicoCarrinho.atualizarBadgeNav();
      this.visao.notificarSucessoAdicao();

      setTimeout(() => navegarPara("/"), 800);
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "Falha ao adicionar item ao carrinho";
      this.visao.notificarErroAdicao(mensagem);
    }
  }
}