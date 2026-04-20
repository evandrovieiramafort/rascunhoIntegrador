import { ItemService } from "../services/ItemService";
import type { HomeView } from "../views/interfaces/HomeView";

export class HomeController {
    private servico: ItemService;

    constructor(private visao: HomeView) {
        this.servico = new ItemService();
    }

    async carregarProdutos(pagina: number = 1): Promise<void> {
        this.visao.exibirCarregamento();
        try {
            const dados = await this.servico.obterItens(pagina);
            this.visao.exibirItens(dados.itens);
            this.visao.exibirPaginacao(dados.paginaAtual, dados.totalPaginas);
        } catch (erro) {
            this.visao.exibirErro("Não foi possível carregar os produtos do servidor.");
        }
    }
}