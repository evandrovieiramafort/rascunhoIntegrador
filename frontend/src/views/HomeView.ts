import { ItemService } from "../services/ItemService";
import type { ItemDTO } from "../domain/Item";

export class HomeView {
    private servico: ItemService;

    constructor() {
        this.servico = new ItemService();
    }

    async iniciar(paginaAtual: number = 1): Promise<void> {
        const container = document.querySelector('#itens-container') as HTMLElement;
        const paginacaoContainer = document.querySelector('#paginacao-container') as HTMLElement;

        if (!container || !paginacaoContainer) return;

        container.innerHTML = `
            <div class="col-12 text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
            </div>`;

        try {
            const dados = await this.servico.obterItens(paginaAtual);
            this.desenharItens(dados.itens, container);
            this.desenharPaginacao(dados.paginaAtual, dados.totalPaginas, paginacaoContainer);
        } catch (error) {
            console.error(error);
            container.innerHTML = '<div class="alert alert-danger w-100">Não foi possível carregar os produtos do servidor.</div>';
            paginacaoContainer.innerHTML = '';
        }
    }

    private desenharItens(itens: ItemDTO[], container: HTMLElement): void {
        const formatadorBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
        
        let html = '';
        itens.forEach(item => {
            const badgeEsgotado = item.estaEsgotado 
                ? '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Esgotado</span>' 
                : '';
                
            const badgeDesconto = item.percentualDesconto > 0 
                ? `<span class="badge bg-success position-absolute top-0 start-0 m-2">-${item.percentualDesconto}%</span>` 
                : '';

            html += `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm position-relative">
                        ${badgeEsgotado}
                        ${badgeDesconto}
                        <img src="${item.foto}" class="card-img-top" alt="${item.descricao}" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${item.descricao}</h5>
                            <p class="card-text text-muted small flex-grow-1">${item.descricaoDetalhada}</p>
                            <div class="mt-3">
                                ${item.percentualDesconto > 0 
                                    ? `<small class="text-decoration-line-through text-muted">${formatadorBRL.format(Number(item.precoVenda))}</small><br>`
                                    : ''}
                                <span class="fs-5 fw-bold text-primary">${formatadorBRL.format(item.precoFinal)}</span>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent border-top-0 pb-3">
                            <button class="btn btn-primary w-100" ${item.estaEsgotado ? 'disabled' : ''}>
                                ${item.estaEsgotado ? 'Sem estoque' : 'Comprar'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    private desenharPaginacao(paginaAtual: number, totalPaginas: number, container: HTMLElement): void {
        let html = '';

        const prevDisabled = paginaAtual <= 1 ? 'disabled' : '';
        html += `
            <li class="page-item ${prevDisabled}">
                <button class="page-link" data-pagina="${paginaAtual - 1}" ${prevDisabled}>Anterior</button>
            </li>`;

        for (let i = 1; i <= totalPaginas; i++) {
            const active = i === paginaAtual ? 'active' : '';
            html += `
                <li class="page-item ${active}">
                    <button class="page-link" data-pagina="${i}">${i}</button>
                </li>`;
        }

        const nextDisabled = paginaAtual >= totalPaginas ? 'disabled' : '';

        html += `
            <li class="page-item ${nextDisabled}">
                <button class="page-link" data-pagina="${paginaAtual + 1}" ${nextDisabled}>Próximo</button>
            </li>`;

        container.innerHTML = html;

        const botoes = container.querySelectorAll('.page-link');
        botoes.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLButtonElement;
                const novaPagina = parseInt(target.dataset.pagina || '1', 10);
                
                const url = new URL(window.location.href);
                url.searchParams.set('pagina', novaPagina.toString());
                window.history.pushState({}, '', url);

                this.iniciar(novaPagina);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }
}